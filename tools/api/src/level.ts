import { Vector3Tuple } from "three";
import { apiUrl } from "./urls";
import { apiRequest } from "./api-request";
import { Metadata } from "./metadata";

export type LevelData = {
  name: string;
  tileData: Vector3Tuple[];
} & Metadata;

export const getLevel = async (id: string) => {
  const resp = await apiRequest(apiUrl(`/levels/${id}`), {
    method: "GET",
  });

  const json = await resp.json();
  return json;
};

export const createLevel = async (
  data: Pick<LevelData, "name" | "tileData">
) => {
  const resp = await apiRequest(apiUrl("/levels"), {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json = await resp.json();
  return json;
};
