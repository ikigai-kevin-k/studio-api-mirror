CREATE TABLE IF NOT EXISTS public.studio (
    "ID" integer NOT NULL,
    "TABLE_ID" character varying(255) NOT NULL,
    "TABLE_STATUS" character varying(255) DEFAULT 'inactive'::character varying NOT NULL,
    "GAME_ID" character varying(255),
    "CREATED_AT" timestamp(3) without time zone DEFAULT now() NOT NULL,
    "UPDATED_AT" timestamp(3) without time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.studio IS 'This table contains studio game table.';
COMMENT ON COLUMN public.studio."ID" IS 'Auto increase number';
COMMENT ON COLUMN public.studio."TABLE_ID" IS 'Unique Table Name';
COMMENT ON COLUMN public.studio."TABLE_STATUS" IS 'The status of game table: inactive, active, and failure Default value is inactive.';
COMMENT ON COLUMN public.studio."GAME_ID" IS 'Game Code ID';
COMMENT ON COLUMN public.studio."CREATED_AT" IS 'When the row was created';
COMMENT ON COLUMN public.studio."UPDATED_AT" IS 'When the row was updated';

CREATE SEQUENCE IF NOT EXISTS public."studio_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."studio_ID_seq" OWNED BY public.studio."ID";


CREATE TABLE IF NOT EXISTS public.studio_cdn (
    "ID" integer NOT NULL,
    "TABLE_ID" character varying(255) NOT NULL,
    "CDN" jsonb NOT NULL,
    "CREATED_AT" timestamp(3) without time zone DEFAULT now() NOT NULL,
    "UPDATED_AT" timestamp(3) without time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.studio_cdn IS 'The cdn path of game table.';
COMMENT ON COLUMN public.studio_cdn."ID" IS 'Auto increase number';
COMMENT ON COLUMN public.studio_cdn."TABLE_ID" IS 'Unique Table Name';
COMMENT ON COLUMN public.studio_cdn."CDN" IS 'CDN Destination';
COMMENT ON COLUMN public.studio_cdn."CREATED_AT" IS 'When the row was created';
COMMENT ON COLUMN public.studio_cdn."UPDATED_AT" IS 'When the row was updated';

CREATE SEQUENCE IF NOT EXISTS public."studio_cdn_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."studio_cdn_ID_seq" OWNED BY public.studio_cdn."ID";


CREATE TABLE IF NOT EXISTS public.studio_device (
    "ID" integer NOT NULL,
    "DEVICE_ID" character varying(255) NOT NULL,
    "TABLE_ID" character varying(255) NOT NULL,
    "CREATED_AT" timestamp(3) without time zone DEFAULT now() NOT NULL,
    "UPDATED_AT" timestamp(3) without time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.studio_device IS 'The device of game table.';
COMMENT ON COLUMN public.studio_device."ID" IS 'Auto increase number';
COMMENT ON COLUMN public.studio_device."DEVICE_ID" IS 'Unique device Name';
COMMENT ON COLUMN public.studio_device."TABLE_ID" IS 'Table Id';
COMMENT ON COLUMN public.studio_device."CREATED_AT" IS 'When the row was created';
COMMENT ON COLUMN public.studio_device."UPDATED_AT" IS 'When the row was updated';

CREATE SEQUENCE IF NOT EXISTS public."studio_device_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."studio_device_ID_seq" OWNED BY public.studio_device."ID";


CREATE TABLE IF NOT EXISTS public.studio_error_signal_log (
    "ID" integer NOT NULL,
    "DEVICE_ID" character varying(255) NOT NULL,
    "ERROR_SIGNAL" jsonb DEFAULT '{}'::jsonb,
    "RESOLVED" boolean DEFAULT false NOT NULL,
    "CREATED_AT" timestamp(3) without time zone DEFAULT now() NOT NULL,
    "UPDATED_AT" timestamp(3) without time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.studio_error_signal_log IS 'The error signal logs.';
COMMENT ON COLUMN public.studio_error_signal_log."ID" IS 'Auto increase number';
COMMENT ON COLUMN public.studio_error_signal_log."DEVICE_ID" IS 'Error Signal Source Device where the error occurred.';
COMMENT ON COLUMN public.studio_error_signal_log."ERROR_SIGNAL" IS 'Error Signal';
COMMENT ON COLUMN public.studio_error_signal_log."RESOLVED" IS 'Is Error resolved.';
COMMENT ON COLUMN public.studio_error_signal_log."CREATED_AT" IS 'When the row was created';
COMMENT ON COLUMN public.studio_error_signal_log."UPDATED_AT" IS 'When the row was updated';

CREATE SEQUENCE IF NOT EXISTS public."studio_error_signal_log_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."studio_error_signal_log_ID_seq" OWNED BY public.studio_error_signal_log."ID";


CREATE TABLE IF NOT EXISTS public.studio_status (
    "ID" integer NOT NULL,
    "TABLE_ID" character varying(255) NOT NULL,
    "UPTIME" integer DEFAULT 0 NOT NULL,
    "MAINTENANCE" boolean DEFAULT true NOT NULL,
    "SDP" character varying(255) DEFAULT 'standby'::character varying NOT NULL,
    "IDP" character varying(255) DEFAULT 'standby'::character varying NOT NULL,
    "BROKER" character varying(255) DEFAULT 'down'::character varying NOT NULL,
    "Z_CAM" character varying(255) DEFAULT 'down'::character varying NOT NULL,
    "ROULETTE" character varying(255) DEFAULT 'down'::character varying NOT NULL,
    "SHAKER" character varying(255) DEFAULT 'down'::character varying NOT NULL,
    "BARCODE_SCANNER" character varying(255) DEFAULT 'down'::character varying NOT NULL,
    "NFC_SCANNER" character varying(255) DEFAULT 'down'::character varying NOT NULL,
    "CREATED_AT" timestamp(3) without time zone DEFAULT now() NOT NULL,
    "UPDATED_AT" timestamp(3) without time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.studio_status IS 'The machine status of studio game table.';
COMMENT ON COLUMN public.studio_status."ID" IS 'Auto increase number';
COMMENT ON COLUMN public.studio_status."TABLE_ID" IS 'Unique Table Name';
COMMENT ON COLUMN public.studio_status."UPTIME" IS 'Execution time (in seconds since startup)';
COMMENT ON COLUMN public.studio_status."MAINTENANCE" IS 'Under maintenance';
COMMENT ON COLUMN public.studio_status."SDP" IS 'SDP service status';
COMMENT ON COLUMN public.studio_status."IDP" IS 'IDP service status';
COMMENT ON COLUMN public.studio_status."BROKER" IS 'Broker device status';
COMMENT ON COLUMN public.studio_status."Z_CAM" IS 'ZCam device status';
COMMENT ON COLUMN public.studio_status."ROULETTE" IS 'Roulette device status';
COMMENT ON COLUMN public.studio_status."SHAKER" IS 'Shaker device status';
COMMENT ON COLUMN public.studio_status."BARCODE_SCANNER" IS 'Barcode scanner device status';
COMMENT ON COLUMN public.studio_status."NFC_SCANNER" IS 'NFC scanner device status';
COMMENT ON COLUMN public.studio_status."CREATED_AT" IS 'When the row was created';
COMMENT ON COLUMN public.studio_status."UPDATED_AT" IS 'When the row was updated';

CREATE SEQUENCE IF NOT EXISTS public."studio_status_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."studio_status_ID_seq" OWNED BY public.studio_status."ID";


ALTER TABLE ONLY public.studio ALTER COLUMN "ID" SET DEFAULT nextval('public."studio_ID_seq"'::regclass);
ALTER TABLE ONLY public.studio_cdn ALTER COLUMN "ID" SET DEFAULT nextval('public."studio_cdn_ID_seq"'::regclass);
ALTER TABLE ONLY public.studio_device ALTER COLUMN "ID" SET DEFAULT nextval('public."studio_device_ID_seq"'::regclass);
ALTER TABLE ONLY public.studio_error_signal_log ALTER COLUMN "ID" SET DEFAULT nextval('public."studio_error_signal_log_ID_seq"'::regclass);
ALTER TABLE ONLY public.studio_status ALTER COLUMN "ID" SET DEFAULT nextval('public."studio_status_ID_seq"'::regclass);


DO $$ BEGIN
    ALTER TABLE ONLY public.studio_cdn ADD CONSTRAINT pk_studio_cdn_id PRIMARY KEY ("ID");
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Constraint pk_studio_cdn_id already exists on table studio_cdn.';
END $$;

DO $$ BEGIN
    ALTER TABLE ONLY public.studio_device ADD CONSTRAINT pk_studio_device_id PRIMARY KEY ("ID");
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Constraint pk_studio_device_id already exists on table studio_device.';
END $$;

DO $$ BEGIN
    ALTER TABLE ONLY public.studio_error_signal_log ADD CONSTRAINT pk_studio_error_signal_log_id PRIMARY KEY ("ID");
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Constraint pk_studio_error_signal_log_id already exists on table studio_error_signal_log.';
END $$;

DO $$ BEGIN
    ALTER TABLE ONLY public.studio_status ADD CONSTRAINT pk_studio_status_id PRIMARY KEY ("ID");
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Constraint pk_studio_status_id already exists on table studio_status.';
END $$;

DO $$ BEGIN
    ALTER TABLE ONLY public.studio ADD CONSTRAINT pk_table_id PRIMARY KEY ("ID");
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Constraint pk_table_id already exists on table studio.';
END $$;


CREATE UNIQUE INDEX IF NOT EXISTS idx_studio_cdn_table_id ON public.studio_cdn USING btree ("TABLE_ID");
CREATE UNIQUE INDEX IF NOT EXISTS idx_studio_device_id ON public.studio_device USING btree ("DEVICE_ID");
CREATE INDEX IF NOT EXISTS idx_studio_error_signal_log_device_id ON public.studio_error_signal_log USING btree ("DEVICE_ID");
CREATE INDEX IF NOT EXISTS idx_studio_error_signal_log_resolved ON public.studio_error_signal_log USING btree ("RESOLVED");
CREATE UNIQUE INDEX IF NOT EXISTS idx_studio_status_table_id ON public.studio_status USING btree ("TABLE_ID");
CREATE UNIQUE INDEX IF NOT EXISTS idx_table_id ON public.studio USING btree ("TABLE_ID");

