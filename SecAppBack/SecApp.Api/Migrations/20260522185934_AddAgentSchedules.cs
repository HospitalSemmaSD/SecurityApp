using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAgentSchedules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DefaultShiftId",
                table: "Agents",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WorkDays",
                table: "Agents",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Agents_DefaultShiftId",
                table: "Agents",
                column: "DefaultShiftId");

            migrationBuilder.AddForeignKey(
                name: "FK_Agents_Shifts_DefaultShiftId",
                table: "Agents",
                column: "DefaultShiftId",
                principalTable: "Shifts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Agents_Shifts_DefaultShiftId",
                table: "Agents");

            migrationBuilder.DropIndex(
                name: "IX_Agents_DefaultShiftId",
                table: "Agents");

            migrationBuilder.DropColumn(
                name: "DefaultShiftId",
                table: "Agents");

            migrationBuilder.DropColumn(
                name: "WorkDays",
                table: "Agents");
        }
    }
}
