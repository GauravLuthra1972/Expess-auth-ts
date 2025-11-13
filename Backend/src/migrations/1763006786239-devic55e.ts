import { MigrationInterface, QueryRunner } from "typeorm";

export class Devic55e1763006786239 implements MigrationInterface {
    name = 'Devic55e1763006786239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trustedevices\` DROP FOREIGN KEY \`FK_73d81a33419d8326477dc641ac7\``);
        await queryRunner.query(`ALTER TABLE \`trustedevices\` ADD \`tokenHash\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`trustedevices\` ADD \`expires_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`trustedevices\` ADD CONSTRAINT \`FK_73d81a33419d8326477dc641ac7\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trustedevices\` DROP FOREIGN KEY \`FK_73d81a33419d8326477dc641ac7\``);
        await queryRunner.query(`ALTER TABLE \`trustedevices\` DROP COLUMN \`expires_at\``);
        await queryRunner.query(`ALTER TABLE \`trustedevices\` DROP COLUMN \`tokenHash\``);
        await queryRunner.query(`ALTER TABLE \`trustedevices\` ADD CONSTRAINT \`FK_73d81a33419d8326477dc641ac7\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
