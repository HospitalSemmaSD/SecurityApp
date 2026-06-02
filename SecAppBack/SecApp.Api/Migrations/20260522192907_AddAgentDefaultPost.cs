using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAgentDefaultPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DefaultDutyPostId",
                table: "Agents",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Agents_DefaultDutyPostId",
                table: "Agents",
                column: "DefaultDutyPostId");

            migrationBuilder.AddForeignKey(
                name: "FK_Agents_DutyPosts_DefaultDutyPostId",
                table: "Agents",
                column: "DefaultDutyPostId",
                principalTable: "DutyPosts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Agents_DutyPosts_DefaultDutyPostId",
                table: "Agents");

            migrationBuilder.DropIndex(
                name: "IX_Agents_DefaultDutyPostId",
                table: "Agents");

            migrationBuilder.DropColumn(
                name: "DefaultDutyPostId",
                table: "Agents");
        }
    }
}
