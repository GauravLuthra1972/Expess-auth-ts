import { MigrationInterface, QueryRunner } from "typeorm";

export class Alterlike1762749680138 implements MigrationInterface {
    name = 'Alterlike1762749680138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_723da61de46f65bb3e3096750d\` ON \`likes\` (\`user_id\`, \`post_id\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_723da61de46f65bb3e3096750d\` ON \`likes\``);
    }

}
