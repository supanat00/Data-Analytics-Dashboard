// src/app/api/getData/route.js
import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library"; // <<< Import JWT เข้ามา

// --- การตั้งค่า ---
const SPREADSHEET_ID = "1f1TDwwXtv2KQBU7suDGL4rLZMOyMtDzytz1OnFf67zQ"; // <--- ใส่ Sheet ID ของคุณ
const WORKSHEET_NAME = "ข้อมูลสรุป"; // <--- แก้ชื่อแท็บถ้าจำเป็น

export async function GET(request) {
  try {
    // 1. สร้าง ServiceAccountAuth โดยใช้ JWT
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // 2. สร้างออบเจ็กต์ GoogleSpreadsheet โดยส่ง auth client เข้าไปเลย
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

    // 3. โหลดข้อมูลชีตทั้งหมด (ไม่ต้อง useServiceAccountAuth แล้ว)
    await doc.loadInfo();

    // 4. เลือก Worksheet (แท็บ) ที่ต้องการ
    const sheet = doc.sheetsByTitle[WORKSHEET_NAME];
    if (!sheet) {
      throw new Error(`ไม่พบ Worksheet ที่ชื่อ '${WORKSHEET_NAME}'`);
    }

    // 5. ดึงข้อมูลทั้งหมดในแท็บนั้น
    const rows = await sheet.getRows();

    // 6. ประมวลผลข้อมูล
    // ตรวจสอบว่ามีข้อมูลอย่างน้อย 5 แถวหรือไม่ (Header + สรุป + ว่าง + Headerรายวัน + ข้อมูลรายวัน)
    if (rows.length < 5) {
      throw new Error("ข้อมูลในชีตไม่ครบถ้วนตามที่คาดหวัง");
    }

    // ข้อมูลสรุป (แถวที่ 2 ในชีต = index 0 ของ rows)
    const summaryRow = rows[0];
    const summary = {};
    sheet.headerValues.forEach((header) => {
      // ใช้ ._rawData เพื่อเข้าถึงค่าจริงๆ, ถ้าไม่มีให้ใช้ '-'
      summary[header] = summaryRow.get(header) || "-";
    });

    // ข้อมูลรายวัน (แถวที่ 6 เป็นต้นไป = index 4 เป็นต้นไปของ rows)
    const dailyRows = rows.slice(3); // เริ่มจากแถวที่ 4 ในข้อมูลที่ดึงมา (แถวที่ 6 ในชีต)
    const daily = dailyRows.map((row) => {
      const rowData = {};
      sheet.headerValues.forEach((header) => {
        rowData[header] = row.get(header) || "";
      });
      return rowData;
    });

    return NextResponse.json({ summary, daily });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
