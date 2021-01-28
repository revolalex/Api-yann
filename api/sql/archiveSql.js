class archiveSql {
    static postArchive = "INSERT INTO archive (text,galerie_name,title,date,filename) VALUES (?)";
    static getAll = `SELECT * FROM archive`;
    static postRating = "INSERT INTO archive_rating (filename, rating) VALUES (?)";
    static getAllRating = `
    SELECT archive_rating.rating, archive.title, archive.filename 
    FROM archive_rating 
    INNER JOIN archive ON archive.filename = archive_rating.filename`
    static getAverage(filename) {
        return `SELECT CAST(AVG(rating) AS decimal(10,2)) FROM archive_rating where filename ="${filename}";`

    }
}
module.exports = archiveSql;