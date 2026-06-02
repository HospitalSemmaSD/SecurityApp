using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIncidentsAndNotices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InternalNotices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsUrgent = table.Column<bool>(type: "bit", nullable: false),
                    AuthorUserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpirationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InternalNotices", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShiftIncidents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Severity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShiftId = table.Column<int>(type: "int", nullable: true),
                    DutyPostId = table.Column<int>(type: "int", nullable: true),
                    ReportedByUserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShiftIncidents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShiftIncidents_DutyPosts_DutyPostId",
                        column: x => x.DutyPostId,
                        principalTable: "DutyPosts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ShiftIncidents_Shifts_ShiftId",
                        column: x => x.ShiftId,
                        principalTable: "Shifts",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ShiftIncidents_DutyPostId",
                table: "ShiftIncidents",
                column: "DutyPostId");

            migrationBuilder.CreateIndex(
                name: "IX_ShiftIncidents_ShiftId",
                table: "ShiftIncidents",
                column: "ShiftId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InternalNotices");

            migrationBuilder.DropTable(
                name: "ShiftIncidents");
        }
    }
}
