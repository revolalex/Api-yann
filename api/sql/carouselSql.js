class carouselSql {
    static deleteImg = "DELETE FROM caroussel where filename = ?"
    static getAll = `SELECT * FROM caroussel`
    static addImg = "INSERT INTO caroussel (filename) VALUES (?)"
}
module.exports = carouselSql;