import { nanoid } from "nanoid";
export class PointRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  //포인트 충전, 환불, 차감 다됨
  caculatePoint = async (userId, point, status, adjustment) => {
    const result = await this.prisma.$transaction(async () => {
      const updatedResultPoint = await this._caculatePoint(userId, point, adjustment)
      const createdHistory = await this._addHistory(point, status, updatedResultPoint.point, updatedResultPoint.pointId)
      return { updatedResultPoint, createdHistory }
    })
    return result;
  }

  //포인트 차감
  subPoint = async (userId, point, status) => {
    const result = await this.prisma.$transaction(async (prisma) => {
      const subPoint = await prisma.points.update({
        where: {
          userId: Number(userId)
        },
        data: {
          point: {
            decrement: Number(point)
          }
        }
      })
      const subHistory = await prisma.pointHistory.create({
        data: {
          historyId: nanoid(),
          point: subPoint.point,
          pointChanged: (`-${point}`),
          status,
          points: {
            connect: {
              pointId: subPoint.pointId
            }
          }
        }
      })
      return { subPoint, subHistory }
    })
    return result;
  }

  //해당 유저의 포인트 조회
  searchPoint = async (userId) => {
    const search = await this.prisma.points.findFirst({
      where: {
        userId: Number(userId)
      }
    })
    return search;
  }

  //해당 유저의 포인트 히스토리 조회
  searchPointHistory = async (pointId) => {
    const search = await this.prisma.pointHistory.findMany({
      where: {
        pointId
      }
    })
    return search;
  }
  _caculatePoint = async (userId, point, adjustment) => {
    let updatedResultPoint;
    if (adjustment === 'increment') {
      updatedResultPoint = await this.prisma.points.update({
        where: {
          userId: Number(userId)
        },
        data: {
          point: {
            increment: Number(point)
          }
        }
      })
    } else if (adjustment === 'decrement') {
      updatedResultPoint = await this.prisma.points.update({
        where: {
          userId: Number(userId)
        },
        data: {
          point: {
            decrement: Number(point)
          }
        }
      })
    }
    return updatedResultPoint;

  }
  _addHistory = async (point, status, resultedPoint, resultedPointId) => {
    const CreatedHistory = await this.prisma.pointHistory.create({
      data: {
        historyId: nanoid(),
        point: resultedPoint,
        pointChanged: point,
        status,
        points: {
          connect: {
            pointId: resultedPointId
          }
        }
      }
    })
    return CreatedHistory;
  }
}

