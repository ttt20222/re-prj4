import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 유효기간 3분 지나면 데이터 삭제
export default async function deleteExpiredUsers() {
    // 3분 전의 시간
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
    const findUser = await prisma.user.findMany({
        where: {
            createdAt: {
                lt: threeMinutesAgo,
            },
            isEmailValid: false,
        },
        select: { userId: true, name: true },
    });

    // user 삭제
    for (const user of findUser) {
        try {
            await prisma.$transaction(async (tx) => {
                // pointlog 삭제
                await tx.pointLog.deleteMany({
                    where: { userId: user.userId },
                });

                // point 삭제
                await tx.point.deleteMany({
                    where: { userId: user.userId },
                });

                //cartdetail 삭제
                await tx.cartDetail.deleteMany({
                    where: { Cart: { userId: user.userId } },
                });

                // cart 삭제
                await tx.cart.deleteMany({
                    where: { userId: user.userId },
                });

                // orderdetail 삭제
                await tx.orderDetail.deleteMany({
                    where: { Order: { userId: user.userId } },
                });

                // order 삭제
                await tx.order.deleteMany({
                    where: { userId: user.userId },
                });

                // review 삭제
                await tx.review.deleteMany({
                    where: { userId: user.userId },
                });

                // restaurant 삭제
                await tx.restaurant.deleteMany({
                    where: { ownerId: user.userId },
                });

                // user 삭제
                await tx.user.deleteMany({
                    where: { userId: user.userId },
                });
            });
            console.log(`${user.name} 유저 이메일 인증 유효기간 만료로 삭제`);
        } catch (error) {
            console.error(`Error deleting user ${user.name}:`, error);
        }
    }
};
