import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPosts11Table1762493359062 implements MigrationInterface {
    name = 'AddPosts11Table1762493359062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`posts_ibfk_1\``);
        await queryRunner.query(`DROP INDEX \`user_id\` ON \`posts\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`image_url\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`status\` varchar(50) NOT NULL DEFAULT 'Draft'`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`likes_count\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`comments_count\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`attachment\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`tags\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`title\` \`title\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`content\` \`content\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`user_id\` \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_c4f9a7bd77b489e711277ee5986\` FOREIGN KEY (\`user_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_c4f9a7bd77b489e711277ee5986\``);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`user_id\` \`user_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`created_at\` \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`content\` \`content\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`title\` \`title\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`tags\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`attachment\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`comments_count\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`likes_count\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`image_url\` varchar(500) NULL`);
        await queryRunner.query(`CREATE INDEX \`user_id\` ON \`posts\` (\`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`posts_ibfk_1\` FOREIGN KEY (\`user_id\`) REFERENCES \`users2\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
