--
-- PostgreSQL database dump
--

\restrict 4uwNWeT0GjSWozEba9bUu6DHf0Z06BftKWLloT8Ov2veiS8hJDXOMhHZWRf3ENc

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO admin;

--
-- Name: api_access_log; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.api_access_log (
    id integer NOT NULL,
    "timestamp" timestamp without time zone,
    method character varying NOT NULL,
    endpoint character varying NOT NULL,
    client_ip character varying NOT NULL,
    user_agent character varying,
    request_body text,
    response_status integer,
    response_time_ms integer,
    host character varying,
    referer character varying
);


ALTER TABLE public.api_access_log OWNER TO admin;

--
-- Name: api_access_log_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.api_access_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_access_log_id_seq OWNER TO admin;

--
-- Name: api_access_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.api_access_log_id_seq OWNED BY public.api_access_log.id;


--
-- Name: platform; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.platform (
    id integer NOT NULL,
    date timestamp without time zone,
    serial_num character varying NOT NULL,
    current_status character varying NOT NULL
);


ALTER TABLE public.platform OWNER TO admin;

--
-- Name: platform_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.platform_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.platform_id_seq OWNER TO admin;

--
-- Name: platform_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.platform_id_seq OWNED BY public.platform.id;


--
-- Name: report; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.report (
    id integer NOT NULL,
    op_name character varying NOT NULL,
    date timestamp without time zone,
    serial_num character varying NOT NULL,
    os_version character varying NOT NULL,
    platform_brand character varying NOT NULL,
    platform character varying NOT NULL,
    platform_phase character varying NOT NULL,
    platform_bios character varying NOT NULL,
    cpu character varying NOT NULL,
    wlan character varying NOT NULL,
    wlan_phase character varying NOT NULL,
    wifi_name character varying,
    wifi_band character varying,
    bt_driver character varying NOT NULL,
    bt_interface character varying NOT NULL,
    wifi_driver character varying NOT NULL,
    audio_driver character varying NOT NULL,
    wrt_version character varying NOT NULL,
    wrt_preset character varying NOT NULL,
    msft_teams_version character varying,
    scenario character varying NOT NULL,
    mouse_bt character varying,
    mouse_brand character varying,
    mouse character varying,
    mouse_click_period character varying,
    keyboard_bt character varying,
    keyboard_brand character varying,
    keyboard character varying,
    keyboard_click_period character varying,
    headset_bt character varying,
    headset_brand character varying,
    headset character varying,
    speaker_bt character varying,
    speaker_brand character varying,
    speaker character varying,
    phone_brand character varying,
    phone character varying,
    device1_brand character varying,
    device1 character varying,
    modern_standby character varying NOT NULL,
    ms_period character varying,
    ms_os_waiting_time character varying,
    s4 character varying NOT NULL,
    s4_period character varying,
    s4_os_waiting_time character varying,
    warm_boot character varying NOT NULL,
    wb_period character varying,
    wb_os_waiting_time character varying,
    cold_boot character varying NOT NULL,
    cb_period character varying,
    cb_os_waiting_time character varying,
    microsoft_teams character varying NOT NULL,
    apm character varying NOT NULL,
    apm_period character varying,
    opp character varying NOT NULL,
    swift_pair character varying NOT NULL,
    power_type character varying NOT NULL,
    urgent_level character varying,
    fix_work_week character varying,
    fix_bt_driver character varying,
    jira_id character varying,
    ips_id character varying,
    hsd_id character varying,
    result character varying NOT NULL,
    fail_cycles character varying,
    cycles character varying,
    duration character varying,
    sys_event_log character varying,
    log_path character varying,
    cpu_codename character varying,
    comment character varying
);


ALTER TABLE public.report OWNER TO admin;

--
-- Name: report_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.report_id_seq OWNER TO admin;

--
-- Name: report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.report_id_seq OWNED BY public.report.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying NOT NULL,
    email character varying,
    hashed_password character varying NOT NULL,
    role character varying NOT NULL,
    avatar character varying,
    created_at timestamp without time zone,
    is_active character varying NOT NULL
);


ALTER TABLE public."user" OWNER TO admin;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO admin;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: api_access_log id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.api_access_log ALTER COLUMN id SET DEFAULT nextval('public.api_access_log_id_seq'::regclass);


--
-- Name: platform id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.platform ALTER COLUMN id SET DEFAULT nextval('public.platform_id_seq'::regclass);


--
-- Name: report id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report ALTER COLUMN id SET DEFAULT nextval('public.report_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.alembic_version (version_num) FROM stdin;
005
\.


--
-- Data for Name: api_access_log; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.api_access_log (id, "timestamp", method, endpoint, client_ip, user_agent, request_body, response_status, response_time_ms, host, referer) FROM stdin;
1	2025-12-18 10:27:11.666978	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	401	4	192.168.70.122:8001	http://192.168.70.122:5174/
2	2025-12-18 10:32:40.855993	POST	/login	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"username": "admin", "password": "***FILTERED***"}	401	185	192.168.70.122:8001	http://192.168.70.122:5174/
3	2025-12-18 10:32:45.652727	POST	/login	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"username": "admin", "password": "***FILTERED***"}	200	174	192.168.70.122:8001	http://192.168.70.122:5174/
4	2025-12-18 10:32:45.702388	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	13	192.168.70.122:8001	http://192.168.70.122:5174/
5	2025-12-18 10:32:45.712949	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
6	2025-12-18 10:32:45.730965	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
7	2025-12-18 10:32:45.751171	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
8	2025-12-18 10:32:45.770685	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
9	2025-12-18 10:32:45.777572	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
10	2025-12-18 10:32:45.783971	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
11	2025-12-18 10:32:45.78982	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
12	2025-12-18 10:32:45.797445	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
13	2025-12-18 10:32:49.932103	GET	/users	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
14	2025-12-18 10:34:01.357373	POST	/users	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"username": "Ernie", "email": "erniex.wu@intel.com", "password": "***FILTERED***", "role": "User"}	200	203	192.168.70.122:8001	http://192.168.70.122:5174/
15	2025-12-18 10:34:01.366228	GET	/users	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
16	2025-12-18 10:34:35.562215	POST	/users	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"username": "Tony", "email": "tonyx.yeh@intel.com", "password": "***FILTERED***", "role": "User"}	200	196	192.168.70.122:8001	http://192.168.70.122:5174/
17	2025-12-18 10:34:35.567868	GET	/users	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
18	2025-12-18 10:35:16.304497	POST	/users	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"username": "Alex", "email": "alexx.c.huang@intel.com", "password": "***FILTERED***", "role": "User"}	200	175	192.168.70.122:8001	http://192.168.70.122:5174/
19	2025-12-18 10:35:16.310637	GET	/users	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
20	2025-12-18 10:36:06.554033	POST	/users	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"username": "Ben", "email": "benx.lai@intel.com", "password": "***FILTERED***", "role": "User"}	200	175	192.168.70.122:8001	http://192.168.70.122:5174/
21	2025-12-18 10:36:06.563002	GET	/users	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
22	2025-12-18 10:36:39.887604	POST	/users	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"username": "Angus", "email": "angusx.cheng@intel.com", "password": "***FILTERED***", "role": "User"}	200	177	192.168.70.122:8001	http://192.168.70.122:5174/
23	2025-12-18 10:36:39.893371	GET	/users	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
24	2025-12-18 10:37:20.366653	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
25	2025-12-18 10:37:26.238315	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
26	2025-12-18 10:37:26.249491	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	6	192.168.70.122:8001	http://192.168.70.122:5174/
27	2025-12-18 10:37:26.255114	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
28	2025-12-18 10:37:26.260278	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
29	2025-12-18 10:37:26.265359	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
30	2025-12-18 10:37:26.270123	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
31	2025-12-18 10:37:26.274677	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
32	2025-12-18 10:37:26.27978	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
38	2025-12-18 10:43:45.471389	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
42	2025-12-18 10:43:45.498309	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
33	2025-12-18 10:37:26.286003	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
35	2025-12-18 10:43:45.450234	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	5	192.168.70.122:8001	http://192.168.70.122:5174/
39	2025-12-18 10:43:45.478117	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
43	2025-12-18 10:43:45.505034	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
44	2025-12-18 10:44:01.398666	POST	/login	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"username": "ernie", "password": "***FILTERED***"}	200	173	192.168.70.122:8001	http://192.168.70.122:5174/
47	2025-12-18 10:44:01.428851	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
49	2025-12-18 10:44:01.439594	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
51	2025-12-18 10:44:01.449739	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
53	2025-12-18 10:44:01.459986	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
54	2025-12-18 10:44:05.152483	POST	/upload-avatar	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	5	192.168.70.122:8001	http://192.168.70.122:5174/
56	2025-12-18 10:44:05.166499	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
58	2025-12-18 10:44:05.176359	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
60	2025-12-18 10:44:05.185612	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
62	2025-12-18 10:44:05.195776	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
34	2025-12-18 10:43:45.436487	POST	/upload-avatar	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	31	192.168.70.122:8001	http://192.168.70.122:5174/
37	2025-12-18 10:43:45.465488	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
41	2025-12-18 10:43:45.491572	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
46	2025-12-18 10:44:01.422845	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
48	2025-12-18 10:44:01.434235	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
50	2025-12-18 10:44:01.444788	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
52	2025-12-18 10:44:01.454654	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
55	2025-12-18 10:44:05.161935	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
57	2025-12-18 10:44:05.171211	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
59	2025-12-18 10:44:05.181115	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
61	2025-12-18 10:44:05.190906	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
63	2025-12-18 10:44:05.199934	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
36	2025-12-18 10:43:45.458812	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
40	2025-12-18 10:43:45.484737	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
45	2025-12-18 10:44:01.415141	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
64	2025-12-18 10:45:18.523773	POST	/upload-avatar	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	56	192.168.70.122:8001	http://192.168.70.122:5174/
65	2025-12-18 10:45:18.534515	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
66	2025-12-18 10:45:18.543092	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
67	2025-12-18 10:45:18.549819	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
68	2025-12-18 10:45:18.556725	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
69	2025-12-18 10:45:18.563149	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
70	2025-12-18 10:45:18.569679	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
71	2025-12-18 10:45:18.57631	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
72	2025-12-18 10:45:18.582421	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
73	2025-12-18 10:45:18.589172	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
74	2025-12-18 10:46:44.158527	POST	/upload-avatar	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	9	192.168.70.122:8001	http://192.168.70.122:5174/
75	2025-12-18 10:46:44.166383	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
76	2025-12-18 10:46:44.172603	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
77	2025-12-18 10:46:44.17839	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
78	2025-12-18 10:46:44.184244	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
79	2025-12-18 10:46:44.190512	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
80	2025-12-18 10:46:44.195466	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
81	2025-12-18 10:46:44.200054	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
82	2025-12-18 10:46:44.205103	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
83	2025-12-18 10:46:44.210009	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
84	2025-12-18 10:46:55.680524	POST	/login	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"username": "admin", "password": "***FILTERED***"}	200	170	192.168.70.122:8001	http://192.168.70.122:5174/
85	2025-12-18 10:46:55.706125	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
86	2025-12-18 10:46:55.713587	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
87	2025-12-18 10:46:55.719121	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
88	2025-12-18 10:46:55.724918	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
89	2025-12-18 10:46:55.729999	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
90	2025-12-18 10:46:55.734479	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
91	2025-12-18 10:46:55.739389	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
92	2025-12-18 10:46:55.743999	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
93	2025-12-18 10:46:55.748345	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
94	2025-12-18 10:46:59.337206	POST	/upload-avatar	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	6	192.168.70.122:8001	http://192.168.70.122:5174/
97	2025-12-18 10:46:59.360024	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
101	2025-12-18 10:46:59.384243	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
107	2025-12-18 10:47:16.473123	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
111	2025-12-18 10:47:16.493704	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
113	2025-12-18 10:47:32.920057	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
117	2025-12-18 10:47:32.943144	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
121	2025-12-18 10:47:32.963675	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
95	2025-12-18 10:46:59.347615	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
99	2025-12-18 10:46:59.372316	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
103	2025-12-18 10:46:59.396147	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
105	2025-12-18 10:47:16.449542	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
109	2025-12-18 10:47:16.482985	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
115	2025-12-18 10:47:32.93189	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
119	2025-12-18 10:47:32.952992	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
96	2025-12-18 10:46:59.353766	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
100	2025-12-18 10:46:59.378544	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
98	2025-12-18 10:46:59.365782	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
102	2025-12-18 10:46:59.390596	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
104	2025-12-18 10:47:16.425047	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	24	192.168.70.122:8001	http://192.168.70.122:5174/
106	2025-12-18 10:47:16.467046	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
108	2025-12-18 10:47:16.477978	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
110	2025-12-18 10:47:16.488605	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
112	2025-12-18 10:47:16.498298	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
114	2025-12-18 10:47:32.926293	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
116	2025-12-18 10:47:32.937218	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
118	2025-12-18 10:47:32.94804	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
120	2025-12-18 10:47:32.958478	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
122	2025-12-18 11:04:03.302144	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	6	192.168.70.122:8001	http://192.168.70.122:5174/
123	2025-12-18 11:04:03.339936	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	9	192.168.70.122:8001	http://192.168.70.122:5174/
124	2025-12-18 11:04:03.366307	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
125	2025-12-18 11:04:03.372926	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
126	2025-12-18 11:04:03.382749	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	5	192.168.70.122:8001	http://192.168.70.122:5174/
127	2025-12-18 11:04:03.392885	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
128	2025-12-18 11:04:03.398597	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
129	2025-12-18 11:04:03.403941	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
130	2025-12-18 11:04:03.410641	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
131	2025-12-18 11:04:03.415787	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
132	2025-12-18 11:04:53.945398	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	6	192.168.70.122:8001	http://192.168.70.122:5174/
133	2025-12-18 11:04:53.955741	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
134	2025-12-18 11:04:53.960836	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
135	2025-12-18 11:04:53.965362	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
136	2025-12-18 11:04:53.969618	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
137	2025-12-18 11:04:53.974838	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
138	2025-12-18 11:04:53.995126	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
139	2025-12-18 11:04:53.999872	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
140	2025-12-18 11:04:54.004576	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
141	2025-12-18 11:10:46.663187	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
142	2025-12-18 11:10:46.696178	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
143	2025-12-18 11:10:46.707	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
144	2025-12-18 11:10:46.727654	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
150	2025-12-18 11:10:46.762819	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
154	2025-12-18 11:50:15.732845	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
160	2025-12-18 11:50:15.768075	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
165	2025-12-18 11:56:46.549571	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
175	2025-12-18 13:52:22.031722	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
185	2025-12-18 14:18:10.093723	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
145	2025-12-18 11:10:46.734195	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
146	2025-12-18 11:10:46.739499	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
149	2025-12-18 11:10:46.757494	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
153	2025-12-18 11:50:15.726834	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
156	2025-12-18 11:50:15.743931	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
157	2025-12-18 11:50:15.74974	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
167	2025-12-18 11:56:46.559677	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
177	2025-12-18 13:52:22.043151	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
187	2025-12-18 14:18:10.105049	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
147	2025-12-18 11:10:46.745932	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
155	2025-12-18 11:50:15.738281	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
159	2025-12-18 11:50:15.761976	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
148	2025-12-18 11:10:46.751298	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
151	2025-12-18 11:50:15.689492	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
152	2025-12-18 11:50:15.72012	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
158	2025-12-18 11:50:15.755834	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
161	2025-12-18 11:56:46.502391	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
163	2025-12-18 11:56:46.539336	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
169	2025-12-18 11:56:46.57131	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
171	2025-12-18 13:52:21.97265	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
173	2025-12-18 13:52:22.020701	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
179	2025-12-18 13:52:22.055136	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
181	2025-12-18 14:18:10.038952	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
183	2025-12-18 14:18:10.082745	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
189	2025-12-18 14:18:10.116541	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
162	2025-12-18 11:56:46.532836	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
168	2025-12-18 11:56:46.565622	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
176	2025-12-18 13:52:22.037514	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
186	2025-12-18 14:18:10.099006	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
164	2025-12-18 11:56:46.544432	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
170	2025-12-18 11:56:46.576608	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
172	2025-12-18 13:52:22.012457	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
178	2025-12-18 13:52:22.049132	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
182	2025-12-18 14:18:10.076263	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
188	2025-12-18 14:18:10.110405	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
166	2025-12-18 11:56:46.554698	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
174	2025-12-18 13:52:22.026596	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
180	2025-12-18 13:52:22.061365	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
184	2025-12-18 14:18:10.088643	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
190	2025-12-18 14:18:10.123082	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
191	2025-12-18 15:14:25.084008	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
192	2025-12-18 15:14:25.11735	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	5	192.168.70.122:8001	http://192.168.70.122:5174/
193	2025-12-18 15:14:25.123575	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
194	2025-12-18 15:14:25.128243	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
195	2025-12-18 15:14:25.133317	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
196	2025-12-18 15:14:25.138534	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
197	2025-12-18 15:14:25.144201	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
198	2025-12-18 15:14:25.150181	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
199	2025-12-18 15:14:25.155601	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
200	2025-12-18 15:14:25.160751	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
201	2025-12-22 10:06:22.700213	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Alex", "date": "2025-12-18 17:48:51", "serial_num": "123490EN400015", "os_version": "10.0.26200", "platform_brand": "Samsung", "platform": "Galaxy Book6 Pro - PRHK", "platform_phase": "DVT2", "platform_bios": "ERHK.0.0.33.372_k0s9_qs", "cpu": "Intel(R) Core(TM) Ultra X7 358H", "wlan": "BE211", "wlan_phase": "B0", "bt_driver": "", "bt_interface": "PCIe ", "wifi_driver": "24.10.1.3", "audio_driver": "", "wrt_version": "24.10.0.1", "wrt_preset": "GACRUX", "msft_teams_version": "25306.804.4102.7193", "scenario": "Hibernation,Idle,Mouse_Function_Check", "mouse_bt": "LE", "mouse_brand": "HP", "mouse": "HP 420/425 Programmable BT Mouse", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "", "headset_brand": "", "headset": "None", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "Y", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Fail", "fail_cycles": "5", "cycles": "31", "duration": "3423", "log_path": "", "sys_event_log": ""}	200	21	192.168.70.122:8001	
202	2025-12-22 10:18:25.582398	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Ernie", "date": "2025-12-18 17:19:42", "serial_num": "123456789", "os_version": "10.0.26200", "platform_brand": "LG Electronics", "platform": "16Z90U-NDV21KB", "platform_phase": "DVT3", "platform_bios": "P1ZK2030 X64", "cpu": "Intel(R) Core(TM) Ultra 5 338H", "wlan": "BE211", "wlan_phase": "B0", "bt_driver": "24.20.0.1", "bt_interface": "PCIe ", "wifi_driver": "24.10.0.4", "audio_driver": "20.43.12572.0", "wrt_version": "24.10.0.1", "wrt_preset": "Enif", "msft_teams_version": "25290.205.4069.4894", "scenario": "Hibernation,Idle,Mouse_Function_Check", "mouse_bt": "LE", "mouse_brand": "Microsoft", "mouse": "Bluetooth Ergonomic Mouse", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "", "headset_brand": "", "headset": "None", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "Y", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Pass", "fail_cycles": "0", "cycles": "3038", "duration": "322605", "log_path": "", "sys_event_log": ""}	200	11	192.168.70.122:8001	
203	2025-12-22 11:06:38.605593	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
204	2025-12-22 11:06:38.652376	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
205	2025-12-22 11:06:38.659528	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
206	2025-12-22 11:06:38.665177	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
207	2025-12-22 11:06:38.67031	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
210	2025-12-22 11:06:38.686966	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
213	2025-12-22 11:32:53.449749	PATCH	/reports/1	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"op_name": "alex", "date": "2025-12-18T17:48:51", "serial_num": "123490EN400015", "os_version": "10.0.26200", "platform_brand": "Samsung", "platform": "Galaxy Book6 Pro - PRHK", "platform_phase": "DVT2", "platform_bios": "ERHK.0.0.33.372_k0s9_qs", "cpu": "Intel(R) Core(TM) Ultra X7 358H", "wlan": "BE211", "wlan_phase": "B0", "wifi_name": null, "wifi_band": null, "bt_driver": "24.20.0.1", "bt_interface": "PCIe ", "wifi_driver": "24.10.1.3", "audio_driver": "20.43.12572.0", "wrt_version": "24.10.0.1", "wrt_preset": "GACRUX", "msft_teams_version": "25306.804.4102.7193", "scenario": "Hibernation,Idle,Mouse_Function_Check", "mouse_bt": "LE", "mouse_brand": "HP", "mouse": "HP 420/425 Programmable BT Mouse", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "", "headset_brand": "", "headset": "None", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "Y", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Fail", "fail_cycles": "5", "cycles": "31", "duration": "3423", "sys_event_log": "", "log_path": "", "id": 1}	200	50	192.168.70.122:8001	http://192.168.70.122:5174/
216	2025-12-22 11:33:33.220677	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
222	2025-12-22 11:33:33.257167	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
228	2025-12-22 13:50:59.122599	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
231	2025-12-22 13:50:59.138028	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
234	2025-12-22 13:50:59.153359	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
208	2025-12-22 11:06:38.676552	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
211	2025-12-22 11:06:38.692397	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
214	2025-12-22 11:32:53.458071	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
215	2025-12-22 11:33:33.182097	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
218	2025-12-22 11:33:33.234162	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
224	2025-12-22 11:33:33.267841	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
225	2025-12-22 13:50:59.078705	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
226	2025-12-22 13:50:59.110634	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	5	192.168.70.122:8001	http://192.168.70.122:5174/
229	2025-12-22 13:50:59.12778	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
232	2025-12-22 13:50:59.143311	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
209	2025-12-22 11:06:38.681782	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
212	2025-12-22 11:06:38.697461	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
217	2025-12-22 11:33:33.226929	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
219	2025-12-22 11:33:33.240245	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
220	2025-12-22 11:33:33.245921	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
223	2025-12-22 11:33:33.262293	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
227	2025-12-22 13:50:59.116837	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
230	2025-12-22 13:50:59.133054	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
233	2025-12-22 13:50:59.148401	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
221	2025-12-22 11:33:33.251147	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
235	2025-12-22 15:11:38.22595	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	7	192.168.70.122:8001	http://192.168.70.122:5174/
236	2025-12-22 15:11:38.292632	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	33	192.168.70.122:8001	http://192.168.70.122:5174/
237	2025-12-22 15:11:38.309864	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
238	2025-12-22 15:11:38.316123	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
239	2025-12-22 15:11:38.336934	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
240	2025-12-22 15:11:38.360559	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	5	192.168.70.122:8001	http://192.168.70.122:5174/
241	2025-12-22 15:11:38.377455	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
242	2025-12-22 15:11:38.397456	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
243	2025-12-22 15:11:38.402569	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
244	2025-12-22 15:11:38.40729	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
245	2025-12-22 16:53:24.846804	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
246	2025-12-22 16:53:24.884308	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	8	192.168.70.122:8001	http://192.168.70.122:5174/
247	2025-12-22 16:53:24.913217	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
248	2025-12-22 16:53:24.920101	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
249	2025-12-22 16:53:24.926901	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
250	2025-12-22 16:53:24.934124	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
251	2025-12-22 16:53:24.940123	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
252	2025-12-22 16:53:24.946003	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
253	2025-12-22 16:53:24.952847	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
254	2025-12-22 16:53:24.973014	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
255	2025-12-23 10:12:20.801691	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Alex", "date": "2025-12-22 16:20:31", "serial_num": "123490EN400015", "os_version": "10.0.26200", "platform_brand": "Samsung", "platform": "Galaxy Book6 Pro - PRHK", "platform_phase": "DVT2", "platform_bios": "ERHK.0.0.33.372_k0s9_qs", "cpu": "Intel(R) Core(TM) Ultra X7 358H", "wlan": "BE211", "wlan_phase": "B0", "bt_driver": "24.20.0.1", "bt_interface": "PCIe ", "wifi_driver": "24.10.1.3", "audio_driver": "20.43.12572.0", "wrt_version": "24.10.0.1", "wrt_preset": "GACRUX", "msft_teams_version": "25306.804.4102.7193", "scenario": "Hibernation,Idle,Mouse_Function_Check", "mouse_bt": "LE", "mouse_brand": "HP", "mouse": "HP 420/425 Programmable BT Mouse", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "", "headset_brand": "", "headset": "None", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "Y", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Pass", "fail_cycles": "0", "cycles": "604", "duration": "64663", "log_path": "", "sys_event_log": ""}	200	26	192.168.70.122:8001	
258	2025-12-23 10:19:07.19718	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	5	192.168.70.122:8001	http://192.168.70.122:5174/
260	2025-12-23 10:19:07.21262	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
261	2025-12-23 10:19:07.219243	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
262	2025-12-23 10:19:07.225721	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
263	2025-12-23 10:19:07.233138	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
256	2025-12-23 10:18:36.631179	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Ernie", "date": "2025-12-23 08:26:04", "serial_num": "123456789", "os_version": "10.0.26200", "platform_brand": "LG Electronics", "platform": "16Z90U-NDV21KB", "platform_phase": "DVT3", "platform_bios": "P1ZK2030 X64", "cpu": "Intel(R) Core(TM) Ultra 5 338H", "wlan": "BE211", "wlan_phase": "B0", "bt_driver": "24.20.0.1", "bt_interface": "PCIe ", "wifi_driver": "24.10.0.4", "audio_driver": "20.43.12572.0", "wrt_version": "24.10.0.1", "wrt_preset": "Gacrux", "msft_teams_version": "25290.205.4069.4894", "scenario": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore", "mouse_bt": "", "mouse_brand": "", "mouse": "None", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "Classic", "headset_brand": "Poly", "headset": "Poly V4320 Series", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "Y", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Fail", "fail_cycles": "1", "cycles": "13", "duration": "1972", "log_path": "", "sys_event_log": ""}	200	8	192.168.70.122:8001	
257	2025-12-23 10:19:07.151653	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
259	2025-12-23 10:19:07.205684	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
265	2025-12-23 10:19:07.247865	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
264	2025-12-23 10:19:07.240295	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
266	2025-12-23 10:19:07.255103	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
267	2025-12-23 10:23:03.481118	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Ernie", "date": "2025-12-22 18:05:32", "serial_num": "PF51H6WD", "os_version": "10.0.26220", "platform_brand": "LENOVO", "platform": "21NSSIT019", "platform_phase": "DVT1", "platform_bios": "N4BET33Zd (0.33 )", "cpu": "Intel(R) Core(TM) Ultra 5 238V", "wlan": "BE201", "wlan_phase": "B0", "bt_driver": "24.10.0.4", "bt_interface": "PCIe ", "wifi_driver": "24.10.0.4", "audio_driver": "20.42.12446.0", "wrt_version": "24.10.0.1", "wrt_preset": "Enif", "msft_teams_version": "25306.804.4102.7193", "scenario": "Mouse_Function_Check,Mouse_Random_Click", "mouse_bt": "LE", "mouse_brand": "Microsoft", "mouse": "BluetoothMouse3600", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "", "headset_brand": "", "headset": "None", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "N", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Pass", "fail_cycles": "0", "cycles": "1124", "duration": "58401", "log_path": "", "sys_event_log": ""}	200	11	192.168.70.122:8001	
268	2025-12-23 10:23:20.199478	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
269	2025-12-23 10:23:20.240675	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
270	2025-12-23 10:23:20.247745	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
271	2025-12-23 10:23:20.254868	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
272	2025-12-23 10:23:20.261551	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
273	2025-12-23 10:23:20.267886	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
274	2025-12-23 10:23:20.273639	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
275	2025-12-23 10:23:20.279567	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
276	2025-12-23 10:23:20.285319	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
277	2025-12-23 10:23:20.290727	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
278	2025-12-23 10:23:25.324649	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
279	2025-12-23 10:23:25.359156	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
280	2025-12-23 10:23:25.365671	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
281	2025-12-23 10:23:25.371121	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
282	2025-12-23 10:23:25.376871	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
283	2025-12-23 10:23:25.382975	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
284	2025-12-23 10:23:25.388803	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
285	2025-12-23 10:23:25.395764	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
286	2025-12-23 10:23:25.40293	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
287	2025-12-23 10:23:25.409109	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
288	2025-12-23 10:46:22.396014	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	8	192.168.70.122:8001	http://192.168.70.122:5174/
289	2025-12-23 10:46:25.289799	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
290	2025-12-23 10:46:44.010884	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
291	2025-12-23 10:47:32.743568	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
292	2025-12-23 11:58:41.184194	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	8	192.168.70.122:8001	http://192.168.70.122:5174/
293	2025-12-23 11:58:41.24309	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	22	192.168.70.122:8001	http://192.168.70.122:5174/
294	2025-12-23 11:58:41.303014	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	50	192.168.70.122:8001	http://192.168.70.122:5174/
295	2025-12-23 11:58:41.310271	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
297	2025-12-23 11:58:41.351636	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
298	2025-12-23 11:58:41.371183	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
299	2025-12-23 11:58:41.39032	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
301	2025-12-23 11:58:41.416674	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
302	2025-12-23 11:58:55.750859	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
303	2025-12-23 11:58:55.788032	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
304	2025-12-23 11:58:55.795189	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
306	2025-12-23 11:58:55.813212	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
308	2025-12-23 11:58:55.825887	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
310	2025-12-23 11:58:55.837646	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
312	2025-12-23 14:55:30.834645	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
316	2025-12-23 14:55:30.91337	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
320	2025-12-23 14:55:30.938469	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
322	2025-12-24 10:06:48.258315	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Alex", "date": "2025-12-23 12:04:34", "serial_num": "123490EN400015", "os_version": "10.0.26200", "platform_brand": "Samsung", "platform": "Galaxy Book6 Pro - PRHK", "platform_phase": "DVT2", "platform_bios": "ERHK.0.0.33.372_k0s9_qs", "cpu": "Intel(R) Core(TM) Ultra X7 358H", "wlan": "BE211", "wlan_phase": "B0", "bt_driver": "24.20.0.1", "bt_interface": "PCIe ", "wifi_driver": "24.10.1.3", "audio_driver": "20.43.12572.0", "wrt_version": "24.10.0.1", "wrt_preset": "GACRUX", "msft_teams_version": "25306.804.4102.7193", "scenario": "Hibernation,Idle,Mouse_Function_Check", "mouse_bt": "LE", "mouse_brand": "HP", "mouse": "HP 420/425 Programmable BT Mouse", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "", "headset_brand": "", "headset": "None", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "Y", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Fail", "fail_cycles": "10", "cycles": "744", "duration": "80010", "log_path": "", "sys_event_log": ""}	200	22	192.168.70.122:8001	
323	2025-12-24 10:13:07.557156	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Angus", "date": "2025-12-23 17:53:10", "serial_num": "0005770SP1", "os_version": "10.0.26200", "platform_brand": "HP", "platform": "HP EliteBook 8 G2i 13 inch Notebook Next Gen AI PC", "platform_phase": "DVT1", "platform_bios": "Y70 Ver. 00.14.30", "cpu": "Genuine Intel(R) 0000", "wlan": "AX211", "wlan_phase": "B0", "bt_driver": "24.20.0.1", "bt_interface": "PCIe ", "wifi_driver": "24.10.0.4", "audio_driver": "20.43.12572.0", "wrt_version": "24.10.0.1", "wrt_preset": "Gacrux", "msft_teams_version": "25332.1210.4188.1171", "scenario": "Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore", "mouse_bt": "", "mouse_brand": "", "mouse": "Microsoft Bluetooth Mouse", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "Keyboard_Filter_01", "keyboard_click_period": "", "headset_bt": "Classic", "headset_brand": "Dell", "headset": "Dell WL5024 Headset", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "Y", "ms_period": "", "ms_os_waiting_time": "", "s4": "N", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "Y", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Fail", "fail_cycles": "19", "cycles": "271", "duration": "53824", "log_path": "", "sys_event_log": ""}	200	6	192.168.70.122:8001	
347	2025-12-24 13:48:58.022992	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
348	2025-12-24 13:48:58.062957	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
349	2025-12-24 13:48:58.071476	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
296	2025-12-23 11:58:41.330658	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
300	2025-12-23 11:58:41.411152	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
305	2025-12-23 11:58:55.803759	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	5	192.168.70.122:8001	http://192.168.70.122:5174/
307	2025-12-23 11:58:55.820102	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
309	2025-12-23 11:58:55.831292	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
311	2025-12-23 11:58:55.843307	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
313	2025-12-23 14:55:30.870501	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	6	192.168.70.122:8001	http://192.168.70.122:5174/
314	2025-12-23 14:55:30.887855	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
315	2025-12-23 14:55:30.907216	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
317	2025-12-23 14:55:30.919586	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
318	2025-12-23 14:55:30.926473	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
319	2025-12-23 14:55:30.93265	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
321	2025-12-23 14:55:30.945626	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
327	2025-12-24 10:26:51.794695	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	5	192.168.70.122:8001	http://192.168.70.122:5174/
328	2025-12-24 10:26:51.826815	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	6	192.168.70.122:8001	http://192.168.70.122:5174/
329	2025-12-24 10:26:51.836128	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
331	2025-12-24 10:26:51.850136	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
332	2025-12-24 10:26:51.85694	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
333	2025-12-24 10:26:51.864762	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
335	2025-12-24 10:26:51.880241	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
336	2025-12-24 10:26:51.889168	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
324	2025-12-24 10:15:56.403782	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "ben", "date": "2025-12-23 17:49:39", "serial_num": "000577136B", "os_version": "10.0.26200", "platform_brand": "HP", "platform": "HP EliteBook X G2i 14 inch Notebook Next Gen AI PC", "platform_phase": "DVT2", "platform_bios": "Y90 Ver. 80.30.18", "cpu": "Intel(R) Core(TM) Ultra X7 358H", "wlan": "BE211", "wlan_phase": "B0", "bt_driver": "24.20.0.1", "bt_interface": "PCIe ", "wifi_driver": "24.10.0.4", "audio_driver": "20.43.12572.0", "wrt_version": "23.160.0.1", "wrt_preset": "Enif", "msft_teams_version": "25306.804.4102.7193", "scenario": "Modern_Standby,Idle,Mouse_Function_Check", "mouse_bt": "", "mouse_brand": "Asus", "mouse": "PS/2 Compatible Mouse", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "Samsung", "keyboard": "Keyboard_Filter_01", "keyboard_click_period": "", "headset_bt": "", "headset_brand": "Asus", "headset": "None", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "Y", "ms_period": "", "ms_os_waiting_time": "", "s4": "N", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "DC", "urgent_level": "P2", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Pass", "fail_cycles": "0", "cycles": "553", "duration": "59004", "log_path": "", "sys_event_log": ""}	200	16	192.168.70.122:8001	
325	2025-12-24 10:16:04.131077	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Ernie", "date": "2025-12-23 17:35:06", "serial_num": "123456789", "os_version": "10.0.26200", "platform_brand": "LG Electronics", "platform": "16Z90U-NDV21KB", "platform_phase": "DVT3", "platform_bios": "P1ZK2030 X64", "cpu": "Intel(R) Core(TM) Ultra 5 338H", "wlan": "BE211", "wlan_phase": "B0", "bt_driver": "24.20.0.1", "bt_interface": "PCIe ", "wifi_driver": "24.10.0.4", "audio_driver": "20.43.12572.0", "wrt_version": "24.10.0.1", "wrt_preset": "Gacrux", "msft_teams_version": "25290.205.4069.4894", "scenario": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore", "mouse_bt": "", "mouse_brand": "", "mouse": "None", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "LE", "headset_brand": "Dell", "headset": "2- Dell WL5024 Headset", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "Y", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Fail", "fail_cycles": "1", "cycles": "29", "duration": "4326", "log_path": "", "sys_event_log": ""}	200	7	192.168.70.122:8001	
326	2025-12-24 10:20:05.426128	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Ernie", "date": "2025-12-23 17:34:34", "serial_num": "PF51H6WD", "os_version": "10.0.26220", "platform_brand": "LENOVO", "platform": "21NSSIT019", "platform_phase": "DVT1", "platform_bios": "N4BET33Zd (0.33 )", "cpu": "Intel(R) Core(TM) Ultra 5 238V", "wlan": "BE201", "wlan_phase": "B0", "bt_driver": "24.10.0.4", "bt_interface": "PCIe ", "wifi_driver": "24.10.0.4", "audio_driver": "20.42.12446.0", "wrt_version": "24.10.0.1", "wrt_preset": "Enif", "msft_teams_version": "25306.804.4102.7193", "scenario": "Mouse_Function_Check,Mouse_Random_Click", "mouse_bt": "LE", "mouse_brand": "Microsoft", "mouse": "BluetoothMouse3600", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "", "headset_brand": "", "headset": "None", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "N", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Pass", "fail_cycles": "0", "cycles": "1159", "duration": "60179", "log_path": "", "sys_event_log": ""}	200	4	192.168.70.122:8001	
330	2025-12-24 10:26:51.843452	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
334	2025-12-24 10:26:51.87267	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
337	2025-12-24 10:51:54.462503	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
338	2025-12-24 10:51:54.536893	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	9	192.168.70.122:8001	http://192.168.70.122:5174/
339	2025-12-24 10:51:54.5488	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	5	192.168.70.122:8001	http://192.168.70.122:5174/
340	2025-12-24 10:51:54.566271	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
341	2025-12-24 10:51:54.586661	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
342	2025-12-24 10:51:54.594837	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
343	2025-12-24 10:51:54.602893	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
344	2025-12-24 10:51:54.610112	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
345	2025-12-24 10:51:54.617414	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
346	2025-12-24 10:51:54.626138	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
350	2025-12-24 13:48:58.079104	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
354	2025-12-24 13:48:58.1049	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
358	2025-12-24 13:49:18.563773	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
362	2025-12-24 13:49:18.600376	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
366	2025-12-24 13:49:18.62386	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
376	2025-12-24 16:40:38.728552	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
381	2025-12-26 10:05:41.02922	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "ben", "date": "2025-12-24 17:20:07", "serial_num": "J3F87M3", "os_version": "10.0.26220", "platform_brand": "Dell Inc.", "platform": "Latitude 9430", "platform_phase": "DVT2", "platform_bios": "89.12.1", "cpu": "12th Gen Intel(R) Core(TM) i7-1265U", "wlan": "AX211", "wlan_phase": "B0", "bt_driver": "23.160.0.9", "bt_interface": "PCIe ", "wifi_driver": "23.160.0.4", "audio_driver": "10.29.0.11192", "wrt_version": "23.160.0.1", "wrt_preset": "Enif", "msft_teams_version": "25332.1210.4188.1171", "scenario": "Modern_Standby,Idle,Mouse_Function_Check", "mouse_bt": "", "mouse_brand": "Dell", "mouse": "PS/2 Compatible Mouse", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "None", "keyboard": "Keyboard_Filter_01", "keyboard_click_period": "", "headset_bt": "", "headset_brand": "None", "headset": "None", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "Y", "ms_period": "", "ms_os_waiting_time": "", "s4": "N", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "DC", "urgent_level": "Fireball", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Pass", "fail_cycles": "0", "cycles": "1000", "duration": "101894", "log_path": "", "sys_event_log": "", "wifi_name": "ASUS_lab_5G", "wifi_band": "5 GHz"}	200	20	192.168.70.122:8001	
382	2025-12-26 10:16:10.928009	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Angus", "date": "2025-12-24 18:27:32", "serial_num": "0005770SP1", "os_version": "10.0.26200", "platform_brand": "HP", "platform": "HP EliteBook 8 G2i 13 inch Notebook Next Gen AI PC", "platform_phase": "DVT1", "platform_bios": "Y70 Ver. 00.14.30", "cpu": "Genuine Intel(R) 0000", "wlan": "AX211", "wlan_phase": "B0", "bt_driver": "24.20.0.1", "bt_interface": "PCIe ", "wifi_driver": "24.10.0.4", "audio_driver": "20.43.12572.0", "wrt_version": "24.10.0.1", "wrt_preset": "Gacrux", "msft_teams_version": "25332.1210.4188.1171", "scenario": "Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore", "mouse_bt": "", "mouse_brand": "", "mouse": "None", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "Keyboard_Filter_01", "keyboard_click_period": "", "headset_bt": "Classic", "headset_brand": "Dell", "headset": "2- Dell WL5024 Headset", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "Y", "ms_period": "", "ms_os_waiting_time": "", "s4": "N", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "Y", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Fail", "fail_cycles": "18", "cycles": "87", "duration": "16563", "log_path": "", "sys_event_log": ""}	200	18	192.168.70.122:8001	
387	2025-12-26 10:16:58.541188	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	8	192.168.70.122:8001	http://192.168.70.122:5174/
398	2025-12-26 10:41:03.249594	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
404	2025-12-26 10:41:03.291754	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
351	2025-12-24 13:48:58.086393	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
355	2025-12-24 13:48:58.111714	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
357	2025-12-24 13:49:09.160738	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Ernie", "date": "2025-12-24 10:56:27", "serial_num": "123456789", "os_version": "10.0.26200", "platform_brand": "LG Electronics", "platform": "16Z90U-NDV21KB", "platform_phase": "DVT3", "platform_bios": "P1ZK2030 X64", "cpu": "Intel(R) Core(TM) Ultra 5 338H", "wlan": "BE211", "wlan_phase": "B0", "bt_driver": "24.20.0.1", "bt_interface": "PCIe ", "wifi_driver": "24.10.0.4", "audio_driver": "20.43.12572.0", "wrt_version": "24.10.0.1", "wrt_preset": "Gacrux", "msft_teams_version": "25290.205.4069.4894", "scenario": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore", "mouse_bt": "", "mouse_brand": "", "mouse": "None", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "LE", "headset_brand": "Dell", "headset": "2- Dell WL5024 Headset", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "Y", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Pass", "fail_cycles": "0", "cycles": "10", "duration": "1470", "log_path": "", "sys_event_log": ""}	200	38	192.168.70.122:8001	
361	2025-12-24 13:49:18.59491	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
365	2025-12-24 13:49:18.61808	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
369	2025-12-24 16:40:38.177868	POST	/login	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"username": "ernie", "password": "***FILTERED***"}	200	174	192.168.70.122:8001	http://192.168.70.122:5174/
371	2025-12-24 16:40:38.625505	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
373	2025-12-24 16:40:38.658733	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
377	2025-12-24 16:40:38.744724	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
379	2025-12-26 10:00:41.049703	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Alex", "date": "2025-12-24 17:58:48", "serial_num": "PF5WL21J", "os_version": "10.0.26200", "platform_brand": "LENOVO", "platform": "21V7SIT057", "platform_phase": "DVT2", "platform_bios": "N4OET20S (0.20 )", "cpu": "Intel(R) Core(TM) Ultra 7 366H", "wlan": "BE211", "wlan_phase": "B0", "bt_driver": "24.20.0.3", "bt_interface": "PCIe ", "wifi_driver": "24.20.0.2", "audio_driver": "20.43.12572.0", "wrt_version": "24.10.0.1", "wrt_preset": "Enif", "msft_teams_version": "25306.804.4102.7193", "scenario": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore", "mouse_bt": "", "mouse_brand": "", "mouse": "None", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "LE", "headset_brand": "Dell", "headset": "2- Dell WL3024 Headset", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "Y", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Pass", "fail_cycles": "0", "cycles": "653", "duration": "145268", "log_path": "", "sys_event_log": ""}	200	10	192.168.70.122:8001	
380	2025-12-26 10:05:03.704506	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Alex", "date": "2025-12-24 17:07:00", "serial_num": "123490EN400015", "os_version": "10.0.26200", "platform_brand": "Samsung", "platform": "Galaxy Book6 Pro - PRHK", "platform_phase": "MP", "platform_bios": "ERHK.0.0.33.372_k0s9_qs", "cpu": "Intel(R) Core(TM) Ultra X7 358H", "wlan": "BE211", "wlan_phase": "B0", "bt_driver": "24.20.0.3", "bt_interface": "PCIe ", "wifi_driver": "24.20.0.2", "audio_driver": "20.43.12572.0", "wrt_version": "24.10.0.1", "wrt_preset": "Gacrux", "msft_teams_version": "25306.804.4102.7193", "scenario": "Hibernation,Idle,Mouse_Function_Check", "mouse_bt": "", "mouse_brand": "HP", "mouse": "HP 420/425 Programmable BT Mouse", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "None", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "", "headset_brand": "None", "headset": "None", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "Y", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "None", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Fail", "fail_cycles": "13", "cycles": "923", "duration": "94208", "log_path": "", "sys_event_log": "", "wifi_name": "ASUS_lab_5G", "wifi_band": "OFF"}	200	15	192.168.70.122:8001	
385	2025-12-26 10:16:58.443939	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
388	2025-12-26 10:16:58.558387	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
448	2025-12-29 14:09:19.323502	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
450	2025-12-29 14:09:19.33904	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
352	2025-12-24 13:48:58.092619	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
356	2025-12-24 13:48:58.118641	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
360	2025-12-24 13:49:18.589084	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
364	2025-12-24 13:49:18.612293	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
374	2025-12-24 16:40:38.692848	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	8	192.168.70.122:8001	http://192.168.70.122:5174/
378	2025-12-24 16:40:38.756441	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
400	2025-12-26 10:41:03.263597	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
353	2025-12-24 13:48:58.098568	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
359	2025-12-24 13:49:18.582437	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
363	2025-12-24 13:49:18.60634	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
367	2025-12-24 13:49:18.629834	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
368	2025-12-24 16:40:33.674987	POST	/login	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"username": "ernie", "password": "***FILTERED***"}	401	185	192.168.70.122:8001	http://192.168.70.122:5174/
370	2025-12-24 16:40:38.612058	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	6	192.168.70.122:8001	http://192.168.70.122:5174/
372	2025-12-24 16:40:38.645013	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
375	2025-12-24 16:40:38.713475	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	5	192.168.70.122:8001	http://192.168.70.122:5174/
383	2025-12-26 10:16:58.001475	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	9	192.168.70.122:8001	http://192.168.70.122:5174/
384	2025-12-26 10:16:58.401376	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
386	2025-12-26 10:16:58.489727	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	6	192.168.70.122:8001	http://192.168.70.122:5174/
390	2025-12-26 10:16:58.594785	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	8	192.168.70.122:8001	http://192.168.70.122:5174/
389	2025-12-26 10:16:58.594397	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	8	192.168.70.122:8001	http://192.168.70.122:5174/
391	2025-12-26 10:16:58.607969	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	20	192.168.70.122:8001	http://192.168.70.122:5174/
392	2025-12-26 10:16:58.608648	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	21	192.168.70.122:8001	http://192.168.70.122:5174/
394	2025-12-26 10:18:38.313438	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Ernie", "date": "2025-12-24 15:27:37", "serial_num": "PF51H6WD", "os_version": "10.0.26220", "platform_brand": "LENOVO", "platform": "21NSSIT019", "platform_phase": "DVT1", "platform_bios": "N4BET33Zd (0.33 )", "cpu": "Intel(R) Core(TM) Ultra 5 238V", "wlan": "BE201", "wlan_phase": "B0", "bt_driver": "24.20.0.3", "bt_interface": "PCIe ", "wifi_driver": "24.20.0.2", "audio_driver": "20.42.12446.0", "wrt_version": "24.10.0.1", "wrt_preset": "Enif", "msft_teams_version": "25332.1210.4188.1171", "scenario": "Mouse_Function_Check,Mouse_Random_Click", "mouse_bt": "LE", "mouse_brand": "Microsoft", "mouse": "BluetoothMouse3600", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "", "headset_brand": "", "headset": "None", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "N", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Fail", "fail_cycles": "3", "cycles": "1210", "duration": "62967", "log_path": "", "sys_event_log": ""}	200	16	192.168.70.122:8001	
396	2025-12-26 10:41:03.232826	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	5	192.168.70.122:8001	http://192.168.70.122:5174/
399	2025-12-26 10:41:03.256527	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
401	2025-12-26 10:41:03.270286	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
402	2025-12-26 10:41:03.277011	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
406	2025-12-26 10:41:47.131595	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
408	2025-12-26 10:41:57.148665	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
424	2025-12-29 11:22:22.073633	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
449	2025-12-29 14:09:19.331381	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
451	2025-12-29 14:09:19.346052	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
452	2025-12-29 14:09:19.367816	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
453	2025-12-29 14:09:19.374806	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
393	2025-12-26 10:17:41.654628	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Ernie", "date": "2025-12-24 17:42:28", "serial_num": "123456789", "os_version": "10.0.26200", "platform_brand": "LG Electronics", "platform": "16Z90U-NDV21KB", "platform_phase": "DVT3", "platform_bios": "P1ZK2030 X64", "cpu": "Intel(R) Core(TM) Ultra 5 338H", "wlan": "BE211", "wlan_phase": "B0", "bt_driver": "24.20.0.3", "bt_interface": "PCIe ", "wifi_driver": "24.20.0.2", "audio_driver": "20.43.12572.0", "wrt_version": "24.10.0.1", "wrt_preset": "Gacrux", "msft_teams_version": "25290.205.4069.4894", "scenario": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore", "mouse_bt": "", "mouse_brand": "", "mouse": "None", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "LE", "headset_brand": "Dell", "headset": "2- Dell WL5024 Headset", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "Y", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Fail", "fail_cycles": "4", "cycles": "49", "duration": "7796", "log_path": "", "sys_event_log": ""}	200	9	192.168.70.122:8001	
395	2025-12-26 10:41:03.199182	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
397	2025-12-26 10:41:03.241827	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
403	2025-12-26 10:41:03.284421	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
405	2025-12-26 10:41:47.121766	PATCH	/reports/17	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"op_name": "ernie", "date": "2025-12-24T15:27:37", "serial_num": "PF51H6WD", "os_version": "10.0.26220", "platform_brand": "LENOVO", "platform": "21NSSIT019", "platform_phase": "DVT1", "platform_bios": "N4BET33Zd (0.33 )", "cpu": "Intel(R) Core(TM) Ultra 5 238V", "cpu_codename": "Lunar Lake", "wlan": "BE201", "wlan_phase": "B0", "wifi_name": null, "wifi_band": null, "bt_driver": "24.20.0.3", "bt_interface": "PCIe ", "wifi_driver": "24.20.0.2", "audio_driver": "20.42.12446.0", "wrt_version": "24.10.0.1", "wrt_preset": "Enif", "msft_teams_version": "25332.1210.4188.1171", "scenario": "Mouse_Function_Check,Mouse_Random_Click", "mouse_bt": "LE", "mouse_brand": "Microsoft", "mouse": "BluetoothMouse3600", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "", "headset_brand": "", "headset": "None", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "N", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Pass", "fail_cycles": "", "cycles": "1210", "duration": "62967", "sys_event_log": "", "log_path": "", "id": 17}	200	57	192.168.70.122:8001	http://192.168.70.122:5174/
407	2025-12-26 10:41:57.140124	PATCH	/reports/17	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"op_name": "ernie", "date": "2025-12-24T15:27:37", "serial_num": "PF51H6WD", "os_version": "10.0.26220", "platform_brand": "LENOVO", "platform": "21NSSIT019", "platform_phase": "DVT1", "platform_bios": "N4BET33Zd (0.33 )", "cpu": "Intel(R) Core(TM) Ultra 5 238V", "cpu_codename": "Lunar Lake", "wlan": "BE201", "wlan_phase": "B0", "wifi_name": null, "wifi_band": null, "bt_driver": "24.20.0.3", "bt_interface": "PCIe ", "wifi_driver": "24.20.0.2", "audio_driver": "20.42.12446.0", "wrt_version": "24.10.0.1", "wrt_preset": "Enif", "msft_teams_version": "25332.1210.4188.1171", "scenario": "Mouse_Function_Check,Mouse_Random_Click", "mouse_bt": "LE", "mouse_brand": "Microsoft", "mouse": "BluetoothMouse3600", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "", "headset_brand": "", "headset": "None", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "N", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Pass", "fail_cycles": "0", "cycles": "1210", "duration": "62967", "sys_event_log": "", "log_path": "", "id": 17}	200	48	192.168.70.122:8001	http://192.168.70.122:5174/
414	2025-12-29 10:22:22.34161	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	1	192.168.70.122:8001	http://192.168.70.122:5174/
416	2025-12-29 10:22:22.378565	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
422	2025-12-29 10:22:22.430685	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
426	2025-12-29 11:22:22.139421	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
432	2025-12-29 11:22:22.189088	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
409	2025-12-29 10:01:29.671156	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Alex", "date": "2025-12-26 17:41:15", "serial_num": "123490EN400015", "os_version": "10.0.26200", "platform_brand": "Samsung", "platform": "Galaxy Book6 Pro - PRHK", "platform_phase": "MP", "platform_bios": "ERHK.0.0.33.372_k0s9_qs", "cpu": "Intel(R) Core(TM) Ultra X7 358H", "wlan": "BE211", "wlan_phase": "B0", "bt_driver": "24.20.0.3", "bt_interface": "PCIe ", "wifi_driver": "24.20.0.2", "audio_driver": "20.43.12572.0", "wrt_version": "24.10.0.1", "wrt_preset": "Gacrux", "msft_teams_version": "25332.1210.4188.1171", "scenario": "Hibernation,Idle,Mouse_Function_Check", "mouse_bt": "", "mouse_brand": "HP", "mouse": "HP 420/425 Programmable BT Mouse", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "None", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "", "headset_brand": "None", "headset": "None", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "Y", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "None", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Fail", "fail_cycles": "1", "cycles": "1000", "duration": "100678", "log_path": "", "sys_event_log": "", "wifi_name": "ASUS_lab_5G", "wifi_band": "OFF"}	200	19	192.168.70.122:8001	
411	2025-12-29 10:12:09.317307	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "ben", "date": "2025-12-26 17:14:54", "serial_num": "J3F87M3", "os_version": "10.0.26220", "platform_brand": "Dell Inc.", "platform": "Latitude 9430", "platform_phase": "DVT2", "platform_bios": "89.12.1", "cpu": "12th Gen Intel(R) Core(TM) i7-1265U", "wlan": "AX211", "wlan_phase": "B0", "bt_driver": "23.160.0.9", "bt_interface": "PCIe ", "wifi_driver": "23.160.0.4", "audio_driver": "10.29.0.11192", "wrt_version": "23.160.0.1", "wrt_preset": "Enif", "msft_teams_version": "25332.1210.4188.1171", "scenario": "Modern_Standby,Idle,Mouse_Function_Check", "mouse_bt": "", "mouse_brand": "Dell", "mouse": "PS/2 Compatible Mouse", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "None", "keyboard": "Keyboard_Filter_01", "keyboard_click_period": "", "headset_bt": "", "headset_brand": "None", "headset": "None", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "Y", "ms_period": "", "ms_os_waiting_time": "", "s4": "N", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "DC", "urgent_level": "Fireball", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Pass", "fail_cycles": "0", "cycles": "1000", "duration": "101718", "log_path": "", "sys_event_log": "", "wifi_name": "ASUS_lab_5G", "wifi_band": "5 GHz"}	200	6	192.168.70.122:8001	
412	2025-12-29 10:14:25.841716	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Angus", "date": "2025-12-26 17:04:02", "serial_num": "0005770SP1", "os_version": "10.0.26200", "platform_brand": "HP", "platform": "HP EliteBook 8 G2i 13 inch Notebook Next Gen AI PC", "platform_phase": "DVT1", "platform_bios": "Y70 Ver. 00.14.30", "cpu": "Genuine Intel(R) 0000", "wlan": "AX211", "wlan_phase": "B0", "bt_driver": "24.20.0.1", "bt_interface": "PCIe ", "wifi_driver": "24.10.0.4", "audio_driver": "20.43.12572.0", "wrt_version": "24.10.0.1", "wrt_preset": "Gacrux", "msft_teams_version": "25332.1210.4188.1171", "scenario": "Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore", "mouse_bt": "", "mouse_brand": "", "mouse": "Microsoft Bluetooth Mouse", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "Keyboard_Filter_01", "keyboard_click_period": "", "headset_bt": "Classic", "headset_brand": "Dell", "headset": "Dell WL5024 Headset", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "Y", "ms_period": "", "ms_os_waiting_time": "", "s4": "N", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "Y", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Fail", "fail_cycles": "6", "cycles": "296", "duration": "57568", "log_path": "", "sys_event_log": ""}	200	16	192.168.70.122:8001	
413	2025-12-29 10:17:32.547554	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Ernie", "date": "2025-12-26 17:27:04", "serial_num": "123456789", "os_version": "10.0.26200", "platform_brand": "LG Electronics", "platform": "16Z90U-NDV21KB", "platform_phase": "DVT3", "platform_bios": "P1ZK2030 X64", "cpu": "Intel(R) Core(TM) Ultra 5 338H", "wlan": "BE211", "wlan_phase": "B0", "bt_driver": "24.20.0.3", "bt_interface": "PCIe ", "wifi_driver": "24.20.0.2", "audio_driver": "20.43.12572.0", "wrt_version": "24.10.0.1", "wrt_preset": "Gacrux", "msft_teams_version": "25290.205.4069.4894", "scenario": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore", "mouse_bt": "", "mouse_brand": "", "mouse": "None", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "LE", "headset_brand": "Dell", "headset": "2- Dell WL5024 Headset", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "Y", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Fail", "fail_cycles": "7", "cycles": "58", "duration": "9361", "log_path": "", "sys_event_log": ""}	200	14	192.168.70.122:8001	
418	2025-12-29 10:22:22.399197	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
428	2025-12-29 11:22:22.157893	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
410	2025-12-29 10:02:23.405791	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "Alex", "date": "2025-12-26 17:45:03", "serial_num": "PF5WL21J", "os_version": "10.0.26200", "platform_brand": "LENOVO", "platform": "21V7SIT057", "platform_phase": "DVT2", "platform_bios": "N4OET20S (0.20 )", "cpu": "Intel(R) Core(TM) Ultra 7 366H", "wlan": "BE211", "wlan_phase": "B0", "bt_driver": "24.20.0.3", "bt_interface": "PCIe ", "wifi_driver": "24.20.0.2", "audio_driver": "20.43.12572.0", "wrt_version": "24.10.0.1", "wrt_preset": "Enif", "msft_teams_version": "25306.804.4102.7193", "scenario": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore", "mouse_bt": "", "mouse_brand": "", "mouse": "None", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "LE", "headset_brand": "Dell", "headset": "None", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "Y", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Pass", "fail_cycles": "0", "cycles": "1000", "duration": "226002", "log_path": "", "sys_event_log": ""}	200	10	192.168.70.122:8001	
415	2025-12-29 10:22:22.371728	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
417	2025-12-29 10:22:22.388879	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	7	192.168.70.122:8001	http://192.168.70.122:5174/
419	2025-12-29 10:22:22.406469	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
420	2025-12-29 10:22:22.414945	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
421	2025-12-29 10:22:22.422964	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
423	2025-12-29 10:22:22.450583	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
425	2025-12-29 11:22:22.126029	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	13	192.168.70.122:8001	http://192.168.70.122:5174/
427	2025-12-29 11:22:22.148829	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
429	2025-12-29 11:22:22.166146	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
430	2025-12-29 11:22:22.173798	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
431	2025-12-29 11:22:22.181751	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
433	2025-12-29 11:22:22.195375	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
434	2025-12-29 14:04:24.135541	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	6	192.168.70.122:8001	http://192.168.70.122:5174/
435	2025-12-29 14:04:24.185039	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	14	192.168.70.122:8001	http://192.168.70.122:5174/
436	2025-12-29 14:04:24.197587	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	6	192.168.70.122:8001	http://192.168.70.122:5174/
437	2025-12-29 14:04:24.205403	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
438	2025-12-29 14:04:24.212459	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
439	2025-12-29 14:04:24.219519	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
440	2025-12-29 14:04:24.227048	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
441	2025-12-29 14:04:24.247974	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
442	2025-12-29 14:04:24.255666	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
443	2025-12-29 14:04:24.262806	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
444	2025-12-29 14:09:19.201156	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	6	192.168.70.122:8001	http://192.168.70.122:5174/
445	2025-12-29 14:09:19.296547	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	67	192.168.70.122:8001	http://192.168.70.122:5174/
446	2025-12-29 14:09:19.306917	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	6	192.168.70.122:8001	http://192.168.70.122:5174/
447	2025-12-29 14:09:19.3157	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
454	2025-12-29 15:32:06.19156	GET	/verify-token	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	2	192.168.70.122:8001	http://192.168.70.122:5174/
455	2025-12-29 15:32:06.238538	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	11	192.168.70.122:8001	http://192.168.70.122:5174/
459	2025-12-29 15:32:06.283055	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
463	2025-12-29 15:32:06.326227	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
464	2025-12-29 16:10:45.968118	POST	/reports/script	10.89.0.1	python-requests/2.32.5	{"op_name": "ben", "date": "2025-12-29 15:50:28", "serial_num": "PF5XFNBA", "os_version": "10.0.26200", "platform_brand": "LENOVO", "platform": "21V9SIT046", "platform_phase": "DVT2", "platform_bios": "N4OET20S (0.20 )", "cpu": "Intel(R) Core(TM) Ultra 7 365", "wlan": "BE211", "wlan_phase": "B0", "bt_driver": "24.20.0.3", "bt_interface": "PCIe ", "wifi_driver": "24.20.0.2", "audio_driver": "20.43.12446.0", "wrt_version": "24.10.0.1", "wrt_preset": "Gaurcx", "msft_teams_version": "25306.804.4102.7193", "scenario": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore", "mouse_bt": "", "mouse_brand": "", "mouse": "None", "mouse_click_period": "", "keyboard_bt": "", "keyboard_brand": "", "keyboard": "None", "keyboard_click_period": "", "headset_bt": "LE", "headset_brand": "Dell", "headset": "2- Dell WL7024 Headset", "speaker_bt": "", "speaker_brand": "", "speaker": "", "phone_brand": "", "phone": "", "device1_brand": "", "device1": "", "modern_standby": "N", "ms_period": "", "ms_os_waiting_time": "", "s4": "Y", "s4_period": "", "s4_os_waiting_time": "", "warm_boot": "N", "wb_period": "", "wb_os_waiting_time": "", "cold_boot": "N", "cb_period": "", "cb_os_waiting_time": "", "microsoft_teams": "N", "apm": "N", "apm_period": "", "opp": "N", "swift_pair": "N", "power_type": "AC", "urgent_level": "NA", "fix_work_week": "", "fix_bt_driver": "", "jira_id": "", "ips_id": "", "hsd_id": "", "result": "Pass", "fail_cycles": "0", "cycles": "1", "duration": "261", "log_path": "", "sys_event_log": ""}	200	34	192.168.70.122:8001	
456	2025-12-29 15:32:06.250228	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
457	2025-12-29 15:32:06.268782	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	4	192.168.70.122:8001	http://192.168.70.122:5174/
460	2025-12-29 15:32:06.290842	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
461	2025-12-29 15:32:06.311501	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
458	2025-12-29 15:32:06.275718	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
462	2025-12-29 15:32:06.318783	GET	/reports	10.89.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	\N	200	3	192.168.70.122:8001	http://192.168.70.122:5174/
\.


--
-- Data for Name: platform; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.platform (id, date, serial_num, current_status) FROM stdin;
\.


--
-- Data for Name: report; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.report (id, op_name, date, serial_num, os_version, platform_brand, platform, platform_phase, platform_bios, cpu, wlan, wlan_phase, wifi_name, wifi_band, bt_driver, bt_interface, wifi_driver, audio_driver, wrt_version, wrt_preset, msft_teams_version, scenario, mouse_bt, mouse_brand, mouse, mouse_click_period, keyboard_bt, keyboard_brand, keyboard, keyboard_click_period, headset_bt, headset_brand, headset, speaker_bt, speaker_brand, speaker, phone_brand, phone, device1_brand, device1, modern_standby, ms_period, ms_os_waiting_time, s4, s4_period, s4_os_waiting_time, warm_boot, wb_period, wb_os_waiting_time, cold_boot, cb_period, cb_os_waiting_time, microsoft_teams, apm, apm_period, opp, swift_pair, power_type, urgent_level, fix_work_week, fix_bt_driver, jira_id, ips_id, hsd_id, result, fail_cycles, cycles, duration, sys_event_log, log_path, cpu_codename, comment) FROM stdin;
9	ernie	2025-12-23 17:35:06	123456789	10.0.26200	LG Electronics	16Z90U-NDV21KB	DVT3	P1ZK2030 X64	Intel(R) Core(TM) Ultra 5 338H	BE211	B0	ASUS_lab_5G	5 GHz	24.20.0.1	PCIe 	24.10.0.4	20.43.12572.0	24.10.0.1	Gacrux	25290.205.4069.4894	Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore			None				None		LE	Dell	2- Dell WL5024 Headset								N			Y			N			N			N	N		N	N	AC	NA						Fail	1	29	4326			Panther Lake	\N
10	ernie	2025-12-23 17:34:34	PF51H6WD	10.0.26220	LENOVO	21NSSIT019	DVT1	N4BET33Zd (0.33 )	Intel(R) Core(TM) Ultra 5 238V	BE201	B0	ASUS_lab_5G	5 GHz	24.10.0.4	PCIe 	24.10.0.4	20.42.12446.0	24.10.0.1	Enif	25306.804.4102.7193	Mouse_Function_Check,Mouse_Random_Click	LE	Microsoft	BluetoothMouse3600				None				None								N			N			N			N			N	N		N	N	AC	NA						Pass	0	1159	60179			Lunar Lake	\N
2	ernie	2025-12-18 17:19:42	123456789	10.0.26200	LG Electronics	16Z90U-NDV21KB	DVT3	P1ZK2030 X64	Intel(R) Core(TM) Ultra 5 338H	BE211	B0	ASUS_lab_5G	5 GHz	24.20.0.1	PCIe 	24.10.0.4	20.43.12572.0	24.10.0.1	Enif	25290.205.4069.4894	Hibernation,Idle,Mouse_Function_Check	LE	Microsoft	Bluetooth Ergonomic Mouse				None				None								N			Y			N			N			N	N		N	N	AC	NA						Pass	0	3038	322605			Panther Lake	\N
1	alex	2025-12-18 17:48:51	123490EN400015	10.0.26200	Samsung	Galaxy Book6 Pro - PRHK	DVT2	ERHK.0.0.33.372_k0s9_qs	Intel(R) Core(TM) Ultra X7 358H	BE211	B0	ASUS_lab_5G	OFF	24.20.0.1	PCIe 	24.10.1.3	20.43.12572.0	24.10.0.1	GACRUX	25306.804.4102.7193	Hibernation,Idle,Mouse_Function_Check	LE	HP	HP 420/425 Programmable BT Mouse				None				None								N			Y			N			N			N	N		N	N	AC	NA						Fail	5	31	3423			Panther Lake	\N
3	alex	2025-12-22 16:20:31	123490EN400015	10.0.26200	Samsung	Galaxy Book6 Pro - PRHK	DVT2	ERHK.0.0.33.372_k0s9_qs	Intel(R) Core(TM) Ultra X7 358H	BE211	B0	ASUS_lab_5G	OFF	24.20.0.1	PCIe 	24.10.1.3	20.43.12572.0	24.10.0.1	GACRUX	25306.804.4102.7193	Hibernation,Idle,Mouse_Function_Check	LE	HP	HP 420/425 Programmable BT Mouse				None				None								N			Y			N			N			N	N		N	N	AC	NA						Pass	0	604	64663			Panther Lake	\N
4	ernie	2025-12-23 08:26:04	123456789	10.0.26200	LG Electronics	16Z90U-NDV21KB	DVT3	P1ZK2030 X64	Intel(R) Core(TM) Ultra 5 338H	BE211	B0	ASUS_lab_5G	5 GHz	24.20.0.1	PCIe 	24.10.0.4	20.43.12572.0	24.10.0.1	Gacrux	25290.205.4069.4894	Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore			None				None		Classic	Poly	Poly V4320 Series								N			Y			N			N			N	N		N	N	AC	NA						Fail	1	13	1972			Panther Lake	\N
5	ernie	2025-12-22 18:05:32	PF51H6WD	10.0.26220	LENOVO	21NSSIT019	DVT1	N4BET33Zd (0.33 )	Intel(R) Core(TM) Ultra 5 238V	BE201	B0	ASUS_lab_5G	5 GHz	24.10.0.4	PCIe 	24.10.0.4	20.42.12446.0	24.10.0.1	Enif	25306.804.4102.7193	Mouse_Function_Check,Mouse_Random_Click	LE	Microsoft	BluetoothMouse3600				None				None								N			N			N			N			N	N		N	N	AC	NA						Pass	0	1124	58401			Lunar Lake	\N
13	alex	2025-12-24 17:07:00	123490EN400015	10.0.26200	Samsung	Galaxy Book6 Pro - PRHK	MP	ERHK.0.0.33.372_k0s9_qs	Intel(R) Core(TM) Ultra X7 358H	BE211	B0	ASUS_lab_5G	OFF	24.20.0.3	PCIe 	24.20.0.2	20.43.12572.0	24.10.0.1	Gacrux	25306.804.4102.7193	Hibernation,Idle,Mouse_Function_Check	LE	HP	HP 420/425 Programmable BT Mouse				None				None								N			Y			N			N			N	N		N	N	AC	NA						Fail	13	923	94208			Panther Lake	\N
11	ernie	2025-12-24 10:56:27	123456789	10.0.26200	LG Electronics	16Z90U-NDV21KB	DVT3	P1ZK2030 X64	Intel(R) Core(TM) Ultra 5 338H	BE211	B0	ASUS_lab_5G	5 GHz	24.20.0.1	PCIe 	24.10.0.4	20.43.12572.0	24.10.0.1	Gacrux	25290.205.4069.4894	Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore			None				None		LE	Dell	2- Dell WL5024 Headset								N			Y			N			N			N	N		N	N	AC	NA						Pass	0	10	1470			Panther Lake	\N
12	alex	2025-12-24 17:58:48	PF5WL21J	10.0.26200	LENOVO	21V7SIT057	DVT2	N4OET20S (0.20 )	Intel(R) Core(TM) Ultra 7 366H	BE211	B0	ASUS_lab_5G	5 GHz	24.20.0.3	PCIe 	24.20.0.2	20.43.12572.0	24.10.0.1	Enif	25306.804.4102.7193	Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore			None				None		LE	Dell	2- Dell WL3024 Headset								N			Y			N			N			N	N		N	N	AC	NA						Pass	0	653	145268			Panther Lake	\N
6	alex	2025-12-23 12:04:34	123490EN400015	10.0.26200	Samsung	Galaxy Book6 Pro - PRHK	DVT2	ERHK.0.0.33.372_k0s9_qs	Intel(R) Core(TM) Ultra X7 358H	BE211	B0	ASUS_lab_5G	OFF	24.20.0.1	PCIe 	24.10.1.3	20.43.12572.0	24.10.0.1	Gacrux	25306.804.4102.7193	Hibernation,Idle,Mouse_Function_Check	LE	HP	HP 420/425 Programmable BT Mouse				None				None								N			Y			N			N			N	N		N	N	AC	NA						Fail	10	744	80010			Panther Lake	\N
18	alex	2025-12-26 17:41:15	123490EN400015	10.0.26200	Samsung	Galaxy Book6 Pro - PRHK	MP	ERHK.0.0.33.372_k0s9_qs	Intel(R) Core(TM) Ultra X7 358H	BE211	B0	ASUS_lab_5G	OFF	24.20.0.3	PCIe 	24.20.0.2	20.43.12572.0	24.10.0.1	Gacrux	25332.1210.4188.1171	Hibernation,Idle,Mouse_Function_Check	LE	HP	HP 420/425 Programmable BT Mouse				None				None								N			Y			N			N			N	N		N	N	AC	NA						Fail	1	1000	100678			Panther Lake	\N
16	ernie	2025-12-24 17:42:28	123456789	10.0.26200	LG Electronics	16Z90U-NDV21KB	DVT3	P1ZK2030 X64	Intel(R) Core(TM) Ultra 5 338H	BE211	B0	ASUS_lab_5G	5 GHz	24.20.0.3	PCIe 	24.20.0.2	20.43.12572.0	24.10.0.1	Gacrux	25290.205.4069.4894	Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore			None				None		LE	Dell	2- Dell WL5024 Headset								N			Y			N			N			N	N		N	N	AC	NA						Fail	4	49	7796			Panther Lake	\N
17	ernie	2025-12-24 15:27:37	PF51H6WD	10.0.26220	LENOVO	21NSSIT019	DVT1	N4BET33Zd (0.33 )	Intel(R) Core(TM) Ultra 5 238V	BE201	B0	ASUS_lab_5G	5 GHz	24.20.0.3	PCIe 	24.20.0.2	20.42.12446.0	24.10.0.1	Enif	25332.1210.4188.1171	Mouse_Function_Check,Mouse_Random_Click	LE	Microsoft	BluetoothMouse3600				None				None								N			N			N			N			N	N		N	N	AC	NA						Pass	0	1210	62967			Lunar Lake	\N
8	ben	2025-12-23 17:49:39	000577136B	10.0.26200	HP	HP EliteBook X G2i 14 inch Notebook Next Gen AI PC	DVT2	Y90 Ver. 80.30.18	Intel(R) Core(TM) Ultra X7 358H	BE211	B0	ASUS_lab_5G	5 GHz	24.20.0.1	PCIe 	24.10.0.4	20.43.12572.0	23.160.0.1	Enif	25306.804.4102.7193	Modern_Standby,Idle,Mouse_Function_Check			None				None				None								Y			N			N			N			N	N		N	N	AC	NA						Pass	0	553	59004			Panther Lake	\N
14	ben	2025-12-24 17:20:07	J3F87M3	10.0.26220	Dell Inc.	Latitude 9430	DVT2	89.12.1	12th Gen Intel(R) Core(TM) i7-1265U	AX211	B0	ASUS_lab_5G	5 GHz	23.160.0.9	PCIe 	23.160.0.4	10.29.0.11192	23.160.0.1	Enif	25332.1210.4188.1171	Modern_Standby,Idle,Mouse_Function_Check			None				None				None								Y			N			N			N			N	N		N	N	AC	NA						Pass	0	1000	101894			Alder Lake	\N
19	alex	2025-12-26 17:45:03	PF5WL21J	10.0.26200	LENOVO	21V7SIT057	DVT2	N4OET20S (0.20 )	Intel(R) Core(TM) Ultra 7 366H	BE211	B0	ASUS_lab_5G	5 GHz	24.20.0.3	PCIe 	24.20.0.2	20.43.12572.0	24.10.0.1	Enif	25306.804.4102.7193	Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore			None				None		LE	Dell	None								N			Y			N			N			N	N		N	N	AC	NA						Pass	0	1000	226002			Panther Lake	\N
15	angus	2025-12-24 18:27:32	0005770SP1	10.0.26200	HP	HP EliteBook 8 G2i 13 inch Notebook Next Gen AI PC	DVT1	Y70 Ver. 00.14.30	Genuine Intel(R) 0000	AX211	B0	ASUS_lab_5G	5 GHz	24.20.0.1	PCIe 	24.10.0.4	20.43.12572.0	24.10.0.1	Gacrux	25332.1210.4188.1171	Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore			None				None		LE	Dell	2- Dell WL5024 Headset								Y			N			N			N			Y	N		N	N	AC	NA						Fail	18	87	16563			Unknown	\N
22	ernie	2025-12-26 17:27:04	123456789	10.0.26200	LG Electronics	16Z90U-NDV21KB	DVT3	P1ZK2030 X64	Intel(R) Core(TM) Ultra 5 338H	BE211	B0	ASUS_lab_5G	5 GHz	24.20.0.3	PCIe 	24.20.0.2	20.43.12572.0	24.10.0.1	Gacrux	25290.205.4069.4894	Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore			None				None		LE	Dell	2- Dell WL5024 Headset								N			Y			N			N			N	N		N	N	AC	NA						Fail	7	58	9361			Panther Lake	\N
20	ben	2025-12-26 17:14:54	J3F87M3	10.0.26220	Dell Inc.	Latitude 9430	DVT2	89.12.1	12th Gen Intel(R) Core(TM) i7-1265U	AX211	B0	ASUS_lab_5G	5 GHz	23.160.0.9	PCIe 	23.160.0.4	10.29.0.11192	23.160.0.1	Enif	25332.1210.4188.1171	Modern_Standby,Idle,Mouse_Function_Check			None				None				None								Y			N			N			N			N	N		N	N	AC	NA						Pass	0	1000	101718			Alder Lake	\N
21	angus	2025-12-26 17:04:02	0005770SP1	10.0.26200	HP	HP EliteBook 8 G2i 13 inch Notebook Next Gen AI PC	DVT1	Y70 Ver. 00.14.30	Genuine Intel(R) 0000	AX211	B0	ASUS_lab_5G	5 GHz	24.20.0.1	PCIe 	24.10.0.4	20.43.12572.0	24.10.0.1	Gacrux	25332.1210.4188.1171	Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore	LE	Microsoft	Microsoft Bluetooth Mouse				None		LE	Dell	Dell WL5024 Headset								Y			N			N			N			Y	N		N	N	AC	NA						Fail	6	296	57568			Unknown	\N
23	ben	2025-12-29 15:50:28	PF5XFNBA	10.0.26200	LENOVO	21V9SIT046	DVT2	N4OET20S (0.20 )	Intel(R) Core(TM) Ultra 7 365	BE211	B0	ASUS_lab_5G	5 GHz	24.20.0.3	PCIe 	24.20.0.2	20.43.12446.0	24.10.0.1	Gaurcx	25306.804.4102.7193	Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore			None				None		LE	Dell	2- Dell WL7024 Headset								N			Y			N			N			N	N		N	N	AC	NA						Pass	0	1	261			Panther Lake	\N
7	angus	2025-12-23 17:53:10	0005770SP1	10.0.26200	HP	HP EliteBook 8 G2i 13 inch Notebook Next Gen AI PC	DVT1	Y70 Ver. 00.14.30	Genuine Intel(R) 0000	AX211	B0	ASUS_lab_5G	5 GHz	24.20.0.1	PCIe 	24.10.0.4	20.43.12572.0	24.10.0.1	Gacrux	25332.1210.4188.1171	Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore	LE	Microsoft	Microsoft Bluetooth Mouse				None		LE	Dell	Dell WL5024 Headset								Y			N			N			N			Y	N		N	N	AC	NA						Fail	19	271	53824			Unknown	\N
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."user" (id, username, email, hashed_password, role, avatar, created_at, is_active) FROM stdin;
3	tony	tonyx.yeh@intel.com	$2b$12$IgJ0c8fUxERzX7c1HrRJ1eyPFOYDsDe17D8IQtkpM3AAZJ6tbTOLq	User	\N	2025-12-18 10:34:35.558253	Y
4	alex	alexx.c.huang@intel.com	$2b$12$QMP4sMyPI0anA0lS0JmQh.yuIphKq7BI.cR0UKkRA9lNDPD.7T0pK	User	\N	2025-12-18 10:35:16.301436	Y
5	ben	benx.lai@intel.com	$2b$12$0g83WwuX6mKAyoR96gN9/u5tJxDNoKOTaWdCHOsbU5/9j8FK8vmDO	User	\N	2025-12-18 10:36:06.548694	Y
6	angus	angusx.cheng@intel.com	$2b$12$L0PkDr9bksc5QrPmRSyMRO80fbWHELMrpCDlLGw.pjdHN6wPjKDXm	User	\N	2025-12-18 10:36:39.884338	Y
2	ernie	erniex.wu@intel.com	$2b$12$VFugXSqH1JkEcA9OEm7fnu2LKvenCwzpWyQYM1hX0uxCw6U6llh6q	User	/uploads/avatars/b35822b855c0475e4e6e22b7ef68c875.jpg	2025-12-18 10:34:01.345812	Y
1	admin	intel123@intel.com	$2b$12$NQYdLGd0bBCP6zie/6jcEufoZlPpK/EzFPGC3hMLm3GbYR/jyLhrK	Administrator	/uploads/avatars/bf08b61094dab15f21ed3b43994c6ace.jpg	2025-12-18 10:29:28.275793	Y
\.


--
-- Name: api_access_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.api_access_log_id_seq', 464, true);


--
-- Name: platform_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.platform_id_seq', 1, false);


--
-- Name: report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.report_id_seq', 23, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.user_id_seq', 6, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: api_access_log api_access_log_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.api_access_log
    ADD CONSTRAINT api_access_log_pkey PRIMARY KEY (id);


--
-- Name: platform platform_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.platform
    ADD CONSTRAINT platform_pkey PRIMARY KEY (id);


--
-- Name: platform platform_serial_num_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.platform
    ADD CONSTRAINT platform_serial_num_key UNIQUE (serial_num);


--
-- Name: report report_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: ix_api_access_log_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ix_api_access_log_id ON public.api_access_log USING btree (id);


--
-- Name: ix_platform_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ix_platform_id ON public.platform USING btree (id);


--
-- Name: ix_report_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ix_report_id ON public.report USING btree (id);


--
-- Name: ix_user_email; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX ix_user_email ON public."user" USING btree (email);


--
-- Name: ix_user_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ix_user_id ON public."user" USING btree (id);


--
-- Name: ix_user_username; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX ix_user_username ON public."user" USING btree (username);


--
-- PostgreSQL database dump complete
--

\unrestrict 4uwNWeT0GjSWozEba9bUu6DHf0Z06BftKWLloT8Ov2veiS8hJDXOMhHZWRf3ENc

