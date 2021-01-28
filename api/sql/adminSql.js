class adminSql {
    static signUp = `INSERT INTO admin (name, is_super_admin, password, email, url) VALUES (?)`;
    static signIn = `SELECT * FROM admin where name = ?`;
    static checkemail = `select * from admin where email = ?`;
    static createAdmins = `INSERT Ignore INTO admin (id, name, is_super_admin, password, email, url) VALUES (?)`;
    static deleteAdmin = "DELETE FROM admin where email = ?";
    static getAll = `SELECT * FROM admin`
    static updateEmail(email, specify) {
        return `UPDATE admin SET email = "${specify}"  WHERE email = "${email}"`
    }
}
module.exports = adminSql;