--It will create tables in Postgres
CREATE TABLE URL_TABLE
(
    id serial NOT NULL PRIMARY KEY,
    URL text,
    URL_ID character(5)
)