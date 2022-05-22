--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3
-- Dumped by pg_dump version 14.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: quiz_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.quiz_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.quiz_seq OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: quiz; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.quiz (
    id integer DEFAULT nextval('public.quiz_seq'::regclass) NOT NULL,
    topic_id integer NOT NULL,
    quiz_title character varying(125) NOT NULL,
    duedate character varying(45) DEFAULT NULL::character varying,
    duetime character varying(45) DEFAULT NULL::character varying,
    questions json,
    reps integer
);


ALTER TABLE public.quiz OWNER TO root;

--
-- Name: result; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.result (
    user_id integer NOT NULL,
    quiz_id integer NOT NULL,
    reps integer DEFAULT 1,
    score integer NOT NULL,
    total_score integer NOT NULL,
    topic_id integer NOT NULL,
    username character varying(45)
);


ALTER TABLE public.result OWNER TO root;

--
-- Name: topics_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.topics_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.topics_seq OWNER TO root;

--
-- Name: topics; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.topics (
    id integer DEFAULT nextval('public.topics_seq'::regclass) NOT NULL,
    title character varying(125) NOT NULL,
    level integer NOT NULL,
    teacher_id integer NOT NULL
);


ALTER TABLE public.topics OWNER TO root;

--
-- Name: users_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.users_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_seq OWNER TO root;

--
-- Name: users; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.users (
    id integer DEFAULT nextval('public.users_seq'::regclass) NOT NULL,
    username character varying(45) NOT NULL,
    password character varying(225) NOT NULL,
    is_teacher character varying(1) DEFAULT NULL::character varying,
    teacher_id integer,
    level integer,
    token character varying(225),
    score integer,
    email character varying(50)
);


ALTER TABLE public.users OWNER TO root;

--
-- Data for Name: quiz; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.quiz (id, topic_id, quiz_title, duedate, duetime, questions, reps) FROM stdin;
\.


--
-- Data for Name: result; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.result (user_id, quiz_id, reps, score, total_score, topic_id, username) FROM stdin;
\.


--
-- Data for Name: topics; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.topics (id, title, level, teacher_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.users (id, username, password, is_teacher, teacher_id, level, token, score, email) FROM stdin;
1	mokytojas	cba7d38bedcac78db4f74ac873a9b88a	Y	\N	\N	\N	\N	toma.burneikaite@gmail.com
2	mokinys	2f7624e3d1d8289e7a0cc7873b09abf0	N	1	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjUzMjQ5NTEzfQ.C60E5vdFOOlxnY8LZe9OFSJMAVlIV1N7oVUq6xoklD8	\N	toma.burneikaite@gmail.com
\.


--
-- Name: quiz_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.quiz_seq', 1, false);


--
-- Name: topics_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.topics_seq', 1, false);


--
-- Name: users_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.users_seq', 2, true);


--
-- Name: quiz quiz_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.quiz
    ADD CONSTRAINT quiz_pkey PRIMARY KEY (id);


--
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- Name: users user_name_unique; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_name_unique UNIQUE (username);


--
-- Name: result user_result; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.result
    ADD CONSTRAINT user_result UNIQUE (user_id, quiz_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: teacherid_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX teacherid_idx ON public.topics USING btree (teacher_id);


--
-- Name: topic_id_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX topic_id_idx ON public.quiz USING btree (topic_id);


--
-- Name: quiz topic_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.quiz
    ADD CONSTRAINT topic_id FOREIGN KEY (topic_id) REFERENCES public.topics(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

