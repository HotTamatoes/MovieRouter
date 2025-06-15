CREATE TABLE movie
(
    title character varying(80) COLLATE pg_catalog."default",
    released date,
    genre character varying(100) COLLATE pg_catalog."default",
    director character varying(80) COLLATE pg_catalog."default",
    plot character varying(750) COLLATE pg_catalog."default",
    poster character varying(200) COLLATE pg_catalog."default",
    id integer NOT NULL,
    rated character(10) COLLATE pg_catalog."default",
    year smallint,
    expires timestamp without time zone,
    titlecompare character varying(80) COLLATE pg_catalog."default",
    CONSTRAINT movie_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

/*
CREATE TABLE theater
(
    title character varying(50) COLLATE pg_catalog."default",
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
)

TABLESPACE pg_default;

CREATE TABLE movieintheater
(
    theater_id INT NOT NULL,
    movie_id INT NOT NULL,
    PRIMARY KEY (theater_id, movie_id),
    FOREIGN KEY (theater_id) REFERENCES theater(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movie(id) ON DELETE CASCADE
)

TABLESPACE pg_default;
*/