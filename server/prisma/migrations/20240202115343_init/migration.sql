-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_joinedRoomId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_joinedRoomId_fkey" FOREIGN KEY ("joinedRoomId") REFERENCES "Room"("roomId") ON DELETE SET NULL ON UPDATE CASCADE;
