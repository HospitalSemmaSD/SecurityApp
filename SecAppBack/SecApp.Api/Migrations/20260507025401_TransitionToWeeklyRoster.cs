using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class TransitionToWeeklyRoster : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailyRosters");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "DutyAssignments",
                newName: "WeekStartDate");

            migrationBuilder.CreateTable(
                name: "WeeklyRosters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsClosed = table.Column<bool>(type: "bit", nullable: false),
                    ClosedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PreparerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreparerRank = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApproverName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApproverRank = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SnapshotData = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeeklyRosters", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WeeklyRosters");

            migrationBuilder.RenameColumn(
                name: "WeekStartDate",
                table: "DutyAssignments",
                newName: "Date");

            migrationBuilder.CreateTable(
                name: "DailyRosters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ApproverName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApproverRank = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClosedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsClosed = table.Column<bool>(type: "bit", nullable: false),
                    PreparerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreparerRank = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SnapshotData = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyRosters", x => x.Id);
                });
        }
    }
}
