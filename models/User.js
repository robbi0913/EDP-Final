const db = require("./db");

const FIELDS = [
  "fld_firstname",
  "fld_middlename",
  "fld_lastname",
  "fld_extname",
  "fld_birthdate",
  "fld_sexatbirth",
  "fld_email"
];

const User = {
  async all() {
    const [rows] = await db.execute("SELECT * FROM info_users");
    return rows;
  },

  async find(id) {
    const [rows] = await db.execute(`SELECT * FROM info_users WHERE fld_id=?`,[id]);
    return rows;
  },

  async create(data) {
    const [result] = await db.execute(
      `INSERT INTO info_users(${FIELDS.join(", ")}) VALUES (${FIELDS.map(()=>"?").join(", ")})`,
      FIELDS.map((f)=>data[f] ?? null)
    );
    return result.insertId;
  },

  async update(id, data) {
    const cols = FIELDS.filter((f)=>data[f] !== undefined);
    if (cols.length===0) { return null }
    const [result] = await db.execute(
      `UPDATE info_users SET ${cols.map((f)=>`${f}=?`).join(", ")} WHERE fld_id=?`,
      [...cols.map((f) => data[f]), id]
    );
    return result.affectedRows;
  },

  async remove(id) {
    const [result] = await db.execute(`DELETE FROM info_users WHERE fld_id=?`, [id]);
    return result.affectedRows;
  }
}

module.exports = User;