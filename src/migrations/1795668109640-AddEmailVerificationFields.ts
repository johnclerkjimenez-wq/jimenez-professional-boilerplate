
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVerificationFields1795668109640 implements MigrationInterface {
    name = 'AddEmailVerificationFields1795668109640';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE INDEX \`IDX_USERS_EMAIL\` ON \`users\` (\`email\`)`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX \`IDX_USERS_EMAIL\` ON \`users\``
        );
    }
}
