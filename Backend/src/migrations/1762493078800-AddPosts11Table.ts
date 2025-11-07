import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPosts11Table1762493078800 implements MigrationInterface {
    name = 'AddPosts11Table1762493078800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Posts11\` DROP COLUMN \`created_at\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Posts11\` ADD \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

}
