import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1795037806977 implements MigrationInterface {
    name = 'InitialSchema1795037806977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_users_email\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_users_email\` ON \`users\` (\`email\`)`);
    }

}
