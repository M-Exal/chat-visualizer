-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_topicId_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
