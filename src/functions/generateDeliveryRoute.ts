import { getDistance } from "./getDistance";
import type { Coordinate, IOrder, OrderRoute, RouteDetails } from "@/types";
import { selectionSort } from "./selectionSort";

export const generateDeliveryRoute = async (startLocation: Coordinate, orders: IOrder[]) => {
  const pointsDistance: Map<string, Map<string, OrderRoute>> = await generatePointsDistance(startLocation, orders);

  const generatePermutations = (orders: IOrder[]) => {
    if (orders.length === 1) {
      return [orders];
    }

    const result: IOrder[][] = [];

    for (let i = 0; i < orders.length; i++) {
      const currentElement = orders[i]!;
      const remainingElements = [...orders.slice(0, i), ...orders.slice(i + 1)];
      const permutationsOfRemaining = generatePermutations(remainingElements);

      for (const permutation of permutationsOfRemaining) {
        result.push([currentElement, ...permutation]);
      }
    }

    return result;
  };

  const routePermutations = generatePermutations(orders);
  const calculatedRoutes: RouteDetails[] = [];

  routePermutations.forEach((route: IOrder[]) => {
    const currentRoute = [];
    let currentDistance = 0;

    for (let i = 0; i < route.length; i++) {
      const nextElement = i + 1;

      if (i === 0) {
        const originToOne = pointsDistance.get("origin")?.get(route[i]!.id);
        currentDistance += originToOne?.routeDescription.distance ?? 0;
        currentRoute.push(originToOne);
      }

      if (nextElement >= route.length) {
        const lastToOrigin = pointsDistance.get(route[i]!.id)?.get("origin");
        currentDistance += lastToOrigin?.routeDescription.distance ?? 0;
        currentRoute.push(lastToOrigin);
        continue;
      }

      const currentToNext = pointsDistance.get(route[i]!.id)?.get(route[nextElement]!.id);
      currentDistance += currentToNext?.routeDescription.distance ?? 0;
      currentRoute.push(currentToNext);
    }

    calculatedRoutes.push({
      orderRoute: currentRoute as OrderRoute[],
      routeDistance: currentDistance,
    });
  });

  return selectionSort(calculatedRoutes, "routeDistance");
};

export const generatePointsDistance = async (startLocation: Coordinate, orders: IOrder[]) => {
  const convertCoordinate = (numbers: number[]): Coordinate => {
    return {
      latitude: numbers[0]!,
      longitude: numbers[1]!,
    };
  };

  const originToPoints = new Map<string, OrderRoute>();
  const pointToPoint = new Map<string, Map<string, OrderRoute>>();

  for (const order of orders) {
    const currentPointToPoint = new Map<string, OrderRoute>();

    originToPoints.set(order.id, {
      destinationId: order.id,
      order: order,
      routeDescription: await getDistance(startLocation, convertCoordinate(order.coordinates)),
    } as OrderRoute);

    for (const orderTwo of orders) {
      if (order.id === orderTwo.id) continue;

      currentPointToPoint.set(orderTwo.id, {
        destinationId: orderTwo.id,
        order: orderTwo,
        routeDescription: await getDistance(
          convertCoordinate(order.coordinates),
          convertCoordinate(orderTwo.coordinates),
        ),
      });
    }

    currentPointToPoint.set("origin", {
      destinationId: "origin",
      order: null,
      routeDescription: await getDistance(convertCoordinate(order.coordinates), startLocation),
    } as OrderRoute);

    pointToPoint.set(order.id, currentPointToPoint);
  }

  pointToPoint.set("origin", originToPoints);

  return pointToPoint;
};
