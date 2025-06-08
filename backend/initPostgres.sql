CREATE TABLE movie
(
    title character varying(80) COLLATE pg_catalog."default",
    released date,
    genre character varying(100) COLLATE pg_catalog."default",
    director character varying(80) COLLATE pg_catalog."default",
    plot character varying(500) COLLATE pg_catalog."default",
    poster character varying(200) COLLATE pg_catalog."default",
    id integer NOT NULL,
    rated character(10) COLLATE pg_catalog."default",
    year smallint,
    expires timestamp without time zone,
    titlecompare character varying(80) COLLATE pg_catalog."default",
    CONSTRAINT movie_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;