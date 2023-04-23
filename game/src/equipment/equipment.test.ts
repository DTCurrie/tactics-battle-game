import { describe, expect, test } from "vitest";
import { BASE_STATS } from "@units/stats";
import { TEST_BASE_STATS } from "@units/units.test";
import { createEquipment } from ".";
import {
  WEAPON_FACTORIES,
  OFF_HAND_FACTORIES,
  ARMOR_FACTORIES,
  ACCESSORY_FACTORIES,
} from "./equipment-data";
import {
  OFF_HAND_SLOT,
  MAIN_HAND_SLOT,
  BODY_SLOT,
  HEAD_SLOT,
  ACCESSORY_SLOT,
} from "./equipment-types";

describe("Equipable", () => {
  test(".equip()", () => {
    const equipable = WEAPON_FACTORIES.sword();
    const next = equipable.equip(TEST_BASE_STATS);

    for (const stat of BASE_STATS) {
      expect(next[stat]).toEqual(
        TEST_BASE_STATS[stat] + (equipable.stats[stat] ?? 0)
      );
    }

    expect(equipable.equipped.get()).toEqual(true);
  });

  test(".unequip()", () => {
    const equipable = WEAPON_FACTORIES.sword();
    let next = equipable.equip(TEST_BASE_STATS);
    next = equipable.unequip(next);

    for (const stat of BASE_STATS) {
      expect(next[stat]).toEqual(TEST_BASE_STATS[stat]);
    }

    expect(equipable.equipped.get()).toEqual(false);
  });
});

describe("Equipment", () => {
  describe(".equip()", () => {
    test("off hand", () => {
      const equipment = createEquipment();
      const offHand = OFF_HAND_FACTORIES.shield();

      const { stats, unequipped } = equipment.equip(
        TEST_BASE_STATS,
        offHand,
        OFF_HAND_SLOT
      );

      for (const stat of BASE_STATS) {
        expect(stats[stat]).toEqual(
          TEST_BASE_STATS[stat] + (offHand.stats[stat] ?? 0)
        );
      }

      expect(unequipped.length).toEqual(0);
    });

    describe("weapons", () => {
      test("main hand", () => {
        const equipment = createEquipment();
        const sword = WEAPON_FACTORIES.sword();

        const { stats, unequipped } = equipment.equip(
          TEST_BASE_STATS,
          sword,
          MAIN_HAND_SLOT
        );

        for (const stat of BASE_STATS) {
          expect(stats[stat]).toEqual(
            TEST_BASE_STATS[stat] + (sword.stats[stat] ?? 0)
          );
        }

        expect(unequipped.length).toEqual(0);
      });

      test("should unequip off hand if dual-wield and equipping non-dual-wield main hand", () => {
        const equipment = createEquipment();
        const sword = WEAPON_FACTORIES.sword();
        const mainDagger = WEAPON_FACTORIES.dagger();
        const offDagger = WEAPON_FACTORIES.dagger();

        const main = equipment.equip(
          TEST_BASE_STATS,
          mainDagger,
          MAIN_HAND_SLOT
        );
        const off = equipment.equip(main.stats, offDagger, OFF_HAND_SLOT);

        for (const stat of BASE_STATS) {
          expect(off.stats[stat]).toEqual(
            TEST_BASE_STATS[stat] +
              (mainDagger.stats[stat] ?? 0) +
              (offDagger.stats[stat] ?? 0)
          );
        }

        expect(off.unequipped.length).toEqual(0);

        const { stats, unequipped } = equipment.equip(
          off.stats,
          sword,
          MAIN_HAND_SLOT
        );

        for (const stat of BASE_STATS) {
          expect(stats[stat]).toEqual(
            TEST_BASE_STATS[stat] + (sword.stats[stat] ?? 0)
          );
        }

        expect(unequipped.length).toEqual(2);
      });

      test("should unequip main hand if not dual-wield and equipping dual-wield off hand", () => {
        const equipment = createEquipment();
        const sword = WEAPON_FACTORIES.sword();
        const offDagger = WEAPON_FACTORIES.dagger();

        const main = equipment.equip(TEST_BASE_STATS, sword, MAIN_HAND_SLOT);

        for (const stat of BASE_STATS) {
          expect(main.stats[stat]).toEqual(
            TEST_BASE_STATS[stat] + (sword.stats[stat] ?? 0)
          );
        }

        expect(main.unequipped.length).toEqual(0);

        const { stats, unequipped } = equipment.equip(
          main.stats,
          offDagger,
          OFF_HAND_SLOT
        );

        for (const stat of BASE_STATS) {
          expect(stats[stat]).toEqual(
            TEST_BASE_STATS[stat] + (offDagger.stats[stat] ?? 0)
          );
        }

        expect(unequipped.length).toEqual(1);
      });

      test("should unequip off hand when equipping two-handed", () => {
        const equipment = createEquipment();
        const staff = WEAPON_FACTORIES.staff();
        const offDagger = WEAPON_FACTORIES.dagger();

        const off = equipment.equip(TEST_BASE_STATS, offDagger, OFF_HAND_SLOT);

        for (const stat of BASE_STATS) {
          expect(off.stats[stat]).toEqual(
            TEST_BASE_STATS[stat] + (offDagger.stats[stat] ?? 0)
          );
        }

        expect(off.unequipped.length).toEqual(0);

        const { stats, unequipped } = equipment.equip(
          off.stats,
          staff,
          MAIN_HAND_SLOT
        );

        for (const stat of BASE_STATS) {
          expect(stats[stat]).toEqual(
            TEST_BASE_STATS[stat] + (staff.stats[stat] ?? 0)
          );
        }

        expect(unequipped.length).toEqual(1);
      });

      test("should unequip two-handed when equipping off hand", () => {
        const equipment = createEquipment();
        const staff = WEAPON_FACTORIES.staff();
        const offDagger = WEAPON_FACTORIES.dagger();

        const main = equipment.equip(TEST_BASE_STATS, staff, MAIN_HAND_SLOT);

        for (const stat of BASE_STATS) {
          expect(main.stats[stat]).toEqual(
            TEST_BASE_STATS[stat] + (staff.stats[stat] ?? 0)
          );
        }

        expect(main.unequipped.length).toEqual(0);

        const { stats, unequipped } = equipment.equip(
          main.stats,
          offDagger,
          OFF_HAND_SLOT
        );

        for (const stat of BASE_STATS) {
          expect(stats[stat]).toEqual(
            TEST_BASE_STATS[stat] + (offDagger.stats[stat] ?? 0)
          );
        }

        expect(unequipped.length).toEqual(1);
      });
    });

    describe("armor", () => {
      test("body", () => {
        const equipment = createEquipment();
        const body = ARMOR_FACTORIES.tunic();

        const { stats, unequipped } = equipment.equip(
          TEST_BASE_STATS,
          body,
          BODY_SLOT
        );

        for (const stat of BASE_STATS) {
          expect(stats[stat]).toEqual(
            TEST_BASE_STATS[stat] + (body.stats[stat] ?? 0)
          );
        }

        expect(unequipped.length).toEqual(0);
      });

      test("head", () => {
        const equipment = createEquipment();
        const head = ARMOR_FACTORIES.cap();

        const { stats, unequipped } = equipment.equip(
          TEST_BASE_STATS,
          head,
          HEAD_SLOT
        );

        for (const stat of BASE_STATS) {
          expect(stats[stat]).toEqual(
            TEST_BASE_STATS[stat] + (head.stats[stat] ?? 0)
          );
        }

        expect(unequipped.length).toEqual(0);
      });
    });

    test("accessories", () => {
      const equipment = createEquipment();
      const accessory = ACCESSORY_FACTORIES.runningShoes();

      const { stats, unequipped } = equipment.equip(
        TEST_BASE_STATS,
        accessory,
        ACCESSORY_SLOT
      );

      for (const stat of BASE_STATS) {
        expect(stats[stat]).toEqual(
          TEST_BASE_STATS[stat] + (accessory.stats[stat] ?? 0)
        );
      }

      expect(unequipped.length).toEqual(0);
    });
  });
});
