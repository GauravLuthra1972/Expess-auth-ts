import { MigrationInterface, QueryRunner } from "typeorm";

export class Device1763005697226 implements MigrationInterface {
    name = 'Device1763005697226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`trustedevices\` (\`id\` int NOT NULL AUTO_INCREMENT, \`deviceFingerprint\` varchar(255) NOT NULL, \`deviceName\` varchar(255) NOT NULL, \`trusted_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`trustedevices\` ADD CONSTRAINT \`FK_73d81a33419d8326477dc641ac7\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trustedevices\` DROP FOREIGN KEY \`FK_73d81a33419d8326477dc641ac7\``);
        await queryRunner.query(`DROP TABLE \`trustedevices\``);
    }

}
