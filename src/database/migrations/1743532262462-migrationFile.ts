import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationFile1743532262462 implements MigrationInterface {
    name = 'MigrationFile1743532262462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" text NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "approved" boolean NOT NULL DEFAULT false, "rejected" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "asset_id" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serial_no" character varying(20) NOT NULL, "type" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "version" character varying(100) NOT NULL, "specifications" text NOT NULL, "condition" "public"."assets_condition_enum" NOT NULL DEFAULT 'New', "assigned_to" uuid, "assigned_status" "public"."assets_assigned_status_enum" NOT NULL DEFAULT 'Available', "assigned_date" TIMESTAMP, "return_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(30) NOT NULL, "email" character varying(100) NOT NULL, "password" text NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "dob" date, "gender" character varying(10), "blood_group" character varying(50), "marital_status" character varying(10), "phone" character varying(10), "address" text, "designation" character varying(50), "department" character varying(50), "city" character varying(50), "state" character varying(50), "pin_code" character varying(10), "country" character varying(50), "status" "public"."users_status_enum" NOT NULL DEFAULT 'Active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "reset_password" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_4bddd455aad7f9c6e33196ae5ae" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assets" ADD CONSTRAINT "FK_6ce7e037e1bac19ddf02d1d82d6" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_6ce7e037e1bac19ddf02d1d82d6"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_4bddd455aad7f9c6e33196ae5ae"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "assets"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
