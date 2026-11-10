// Pixel Asset Library for Text-to-Pixel-Grid Chibi & Layered Scene Generation
// All assets are represented as pure 2D character grids (rows of palette indices / symbols)
// Proportions: Head is ~50% of total height, short legs, 1px dark contour, 6-12 colors, 2x2/2x3 eyes with 1 highlight pixel.

export interface PixelAsset {
  id: string;
  name: string;
  category: "body" | "hair" | "eyes" | "clothes" | "props" | "building" | "nature";
  width: number;
  height: number;
  // Key: symbol -> color role or default hex
  legend: Record<string, string>;
  // 2D grid of characters
  grid: string[];
}

export const CHIBI_ASSETS: Record<string, PixelAsset> = {
  // Base Chibi Body (Height: 32px, Head: 16px (50%), Torso: 8px (25%), Legs: 8px (25%))
  baseBodyChibi: {
    id: "baseBodyChibi",
    name: "Standard Chibi Base",
    category: "body",
    width: 22,
    height: 32,
    legend: {
      ".": "transparent",
      "#": "outline",     // Dark skin outline
      "S": "skin_base",   // #FDD5B1
      "H": "skin_shadow", // #E2A76F
      "B": "blush",       // #FF9999
    },
    grid: [
      "......########.......", // r00
      "....##SSSSSSSS##.....", // r01
      "...#SSSSSSSSSSSS#....", // r02
      "..#SSSSSSSSSSSSSS#...", // r03
      ".#SSSSSSSSSSSSSSSS#..", // r04
      ".#SSSSSSSSSSSSSSSS#..", // r05
      "#SSSSSSSSSSSSSSSSSS#.", // r06
      "#SSSSSSSSSSSSSSSSSS#.", // r07
      "#SSSSSSSSSSSSSSSSSS#.", // r08
      "#SSSSSSSSSSSSSSSSSS#.", // r09
      "#SSBSSSSSSSSSSSSBSS#.", // r10 (blush)
      "#SSBBSSSSSSSSSSBBSS#.", // r11 (blush)
      ".#SSSSSSSSSSSSSSSS#..", // r12
      "..#SSSSSSSSSSSSSS#...", // r13
      "...##SSSSSSSSSS##....", // r14
      ".....##########......", // r15 (end of head = 16px)
      ".......#SSSS#........", // r16 (neck)
      ".....##SSSSSS##......", // r17 (shoulders/torso start)
      "....#SSSSSSSSSS#.....", // r18
      "....#SSSSSSSSSS#.....", // r19
      "....#SSSSSSSSSS#.....", // r20
      "....#SSSSSSSSSS#.....", // r21
      "....#SSSSSSSSSS#.....", // r22
      ".....##########......", // r23 (waist = 8px torso)
      ".....#SS#..#SS#......", // r24 (legs start)
      ".....#SS#..#SS#......", // r25
      ".....#SS#..#SS#......", // r26
      ".....#SS#..#SS#......", // r27
      ".....#SS#..#SS#......", // r28
      ".....#SS#..#SS#......", // r29
      "....##SS#..#SS##.....", // r30 (feet)
      "....####....####.....", // r31 (8px legs)
    ],
  },

  // Chibi Eyes (2x3 block with 1 highlight pixel)
  eyesChibi: {
    id: "eyesChibi",
    name: "Sparkle Chibi Eyes",
    category: "eyes",
    width: 14,
    height: 4,
    legend: {
      ".": "transparent",
      "#": "eye_contour", // #1E1B18
      "P": "eye_iris",    // #3B82F6 or #10B981 or #8B5CF6
      "L": "eye_light",   // #FFFFFF (the 1 highlight pixel)
    },
    grid: [
      "#L##......#L##",
      "#PL#......#PL#",
      "#PP#......#PP#",
      ".##........##.",
    ],
  },

  // Hair 1: Spiky Anime Clustered Hair
  hairSpiky: {
    id: "hairSpiky",
    name: "Spiky Shonen Hair",
    category: "hair",
    width: 26,
    height: 18,
    legend: {
      ".": "transparent",
      "#": "hair_outline",
      "M": "hair_main",   // Primary hair color
      "H": "hair_hilite", // Highlights
      "S": "hair_shadow", // Lowlights
    },
    grid: [
      ".........###..............",
      ".......##MMM###...........",
      ".....##MMHHMMMM##.........",
      "....#MMHHHHMMMMMM##.......",
      "...#MMHHMMMMMMMMMMM##.....",
      "..#MMMHHMMMMMMMMMMMMM#....",
      ".#MMMMHMMMMMMMMMMMMMMM#...",
      "#MMMMMMMMMMMMMMMMMMMMMM#..",
      "#MMMMMMMMMMMMMMMMMMMMMM#..",
      "#MM#..###MMMMMM###..#MM#..",
      "#MM#.....#MMMM#.....#MM#..",
      ".##.......#MM#.......##...",
      "...........##.............",
      "..........................",
      "..........................",
      "..........................",
      "..........................",
      "..........................",
    ],
  },

  // Hair 2: Bob Cut with Bangs
  hairBob: {
    id: "hairBob",
    name: "Bob Cut with Bangs",
    category: "hair",
    width: 24,
    height: 19,
    legend: {
      ".": "transparent",
      "#": "hair_outline",
      "M": "hair_main",
      "H": "hair_hilite",
      "S": "hair_shadow",
    },
    grid: [
      ".......########.........",
      ".....##MMMMMMMM##.......",
      "...##MMHHHHHHHHMM##.....",
      "..#MMMMHHHHHHHHMMMM#....",
      ".#MMMMMMMMMMMMMMMMMM#...",
      ".#MMMMMMMMMMMMMMMMMM#...",
      "#MMMMMMMMMMMMMMMMMMMM#..",
      "#MMMMMMMMMMMMMMMMMMMM#..",
      "#MMM#MMM#MMMM#MMM#MMM#..",
      "#MMM#MMM#MMMM#MMM#MMM#..",
      "#MM#..#...##...#..#MM#..",
      "#MM#..............#MM#..",
      "#MM#..............#MM#..",
      "#SS#..............#SS#..",
      ".##................##...",
      "........................",
      "........................",
      "........................",
      "........................",
    ],
  },

  // Clothes 1: Samurai Haori & Hakama
  clothesSamurai: {
    id: "clothesSamurai",
    name: "Samurai Haori & Hakama",
    category: "clothes",
    width: 22,
    height: 16,
    legend: {
      ".": "transparent",
      "#": "cloth_outline",
      "C": "cloth_main",    // Indigo/Cyan haori
      "A": "cloth_accent",  // White collar / crest
      "K": "cloth_hakama",  // Charcoal hakama pants
      "O": "cloth_obi",     // Crimson belt
    },
    grid: [
      ".....##AAAA##........",
      "....#CC#AA#CC#.......",
      "....#CCC##CCC#.......",
      "....#CCCCCCCC#.......",
      "....#CCCOOCCC#.......", // Belt
      ".....##OOOO##........",
      ".....#KKKKKK#........", // Hakama
      "....#KKKKKKKK#.......",
      "....#KKK##KKK#.......",
      "....#KKK##KKK#.......",
      "....#KKK##KKK#.......",
      "....#KKK##KKK#.......",
      "....#KKK##KKK#.......",
      "....#KKK##KKK#.......",
      "....####..####.......",
      ".....................",
    ],
  },

  // Clothes 2: Cyberpunk Trench & Neon Accents
  clothesCyberpunk: {
    id: "clothesCyberpunk",
    name: "Cyberpunk Trench Coat",
    category: "clothes",
    width: 22,
    height: 16,
    legend: {
      ".": "transparent",
      "#": "cloth_outline",
      "T": "cloth_trench",  // #1A1A24 Dark Trench
      "N": "cloth_neon",    // #00FFCC Neon piping
      "P": "cloth_pants",   // #2D3748 Tech pants
    },
    grid: [
      ".....##NNNN##........",
      "....#TT#NN#TT#.......",
      "...#TTTT##TTTT#......",
      "...#TTNTNNTNTT#......",
      "...#TTNTNNTNTT#......",
      "....#TTTNNTTT#.......",
      "....#NNNNNNNN#.......",
      "....#PPPTTPPP#.......",
      "....#PPP##PPP#.......",
      "....#PPP##PPP#.......",
      "....#PPP##PPP#.......",
      "....#PPP##PPP#.......",
      "...#TTTT##TTTT#......",
      "...#TT##..##TT#......",
      "...####....####......",
      ".....................",
    ],
  },

  // Environment: Traditional Pagoda / Temple
  buildingPagoda: {
    id: "buildingPagoda",
    name: "Mountain Temple Pagoda",
    category: "building",
    width: 44,
    height: 48,
    legend: {
      ".": "transparent",
      "#": "#181414", // Dark structural wood
      "R": "#8B1E1E", // Crimson roof tiles
      "Y": "#D97706", // Gold finial / ornament
      "W": "#E5E1D8", // Paper screens / walls
      "L": "#F59E0B", // Warm lantern paper
    },
    grid: [
      ".....................##.....................",
      "....................#YY#....................",
      "....................#YY#....................",
      "...................#YYYY#...................",
      "....................####....................",
      "..................###RR###..................",
      "...............###RRRRRR###.................",
      "............###RRRRRRRRRRRR###..............",
      "..........##RRRRRRRRRRRRRRRRRR##............",
      "........##RRRRRRRRRRRRRRRRRRRRRR##..........",
      "......##RRRRRRRRRRRRRRRRRRRRRRRRRR##........",
      "....##RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR##......",
      "..##RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR##....",
      "############################################",
      "...........#WWWWW#WWWW#WWWWW#...............",
      "...........#W###W#W##W#W###W#...............",
      "...........#W#L#W#W##W#W#L#W#...............",
      "...........#W###W#W##W#W###W#...............",
      "...........#WWWWW#WWWW#WWWWW#...............",
      "..........####################..............",
      "........##RRRRRRRRRRRRRRRRRRRR##............",
      "......##RRRRRRRRRRRRRRRRRRRRRRRR##..........",
      "....##RRRRRRRRRRRRRRRRRRRRRRRRRRRR##........",
      "..##RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR##......",
      "############################################",
      ".........#WWWWWW#WWWWWW#WWWWWW#.............",
      ".........#WW##WW#WW##WW#WW##WW#.............",
      ".........#WW#L#W#WW##WW#W#L#WW#.............",
      ".........#WW##WW#WW##WW#WW##WW#.............",
      ".........#WWWWWW#WWWWWW#WWWWWW#.............",
      "........########################............",
      "......##RRRRRRRRRRRRRRRRRRRRRRRR##..........",
      "....##RRRRRRRRRRRRRRRRRRRRRRRRRRRR##........",
      "..##RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR##......",
      "##RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR##....",
      "############################################",
      ".......#WWWWWW#WWWWWWWWWW#WWWWWW#...........",
      ".......#WW##WW#WW######WW#WW##WW#...........",
      ".......#WW#L#W#WW######WW#W#L#WW#...........",
      ".......#WW##WW#WW######WW#WW##WW#...........",
      ".......#WWWWWW#WW######WW#WWWWWW#...........",
      ".......#WWWWWW#WW######WW#WWWWWW#...........",
      ".......#WWWWWW#WW######WW#WWWWWW#...........",
      "......############################..........",
      ".....#SSSSSSSSSSSSSSSSSSSSSSSSSSSS#.........",
      "....#SSSSSSSSSSSSSSSSSSSSSSSSSSSSSS#........",
      "...#SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS#.......",
      "..####################################......",
    ],
  },

  // Environment: Cherry Blossom Tree
  treeCherryBlossom: {
    id: "treeCherryBlossom",
    name: "Blooming Sakura Tree",
    category: "nature",
    width: 38,
    height: 36,
    legend: {
      ".": "transparent",
      "#": "#2B1A12", // Bark outline
      "T": "#4A2E1F", // Wood trunk
      "P": "#FF80AA", // Pink petals
      "W": "#FFD1DC", // Soft white-pink highlight petals
      "D": "#D6336C", // Deep petal shadow
    },
    grid: [
      "..............######..................",
      "..........####WWPPWW####..............",
      "........##WWPPPPPPPPPPWW##............",
      ".......#WWPPPPPPPPPPPPPPWW#...........",
      ".....##WWPPPPPPPPPPPPPPPPWW##.........",
      "....#WWPPPPPPPPPPPPPPPPPPPPWW#........",
      "...#WWPPPPPDDPPPPPPDDPPPPPPPWW#.......",
      "..#WWPPPPPDDDDPPPDDDDPPPPPPPPWW#......",
      "..#WWPPPPPDDDDPPPDDDDPPPPPPPPWW#......",
      ".#WWPPPPPPPDDPPPPPPDDPPPPPPPPPWW#.....",
      ".#WWPPPPPPPPPPPPPPPPPPPPPPPPPPWW#.....",
      "#WWPPPPPPPPPPPPPPPPPPPPPPPPPPPPWW#....",
      "#WWPPPDDPPPPPPDDPPPPPPDDPPPPPPPDD#....",
      "#WWPPDDDDPPPDDDDPPPDDDDPPPPPPDDDD#....",
      ".#PPDDDDPPPDDDDPPPDDDDPPPPPPDDDD#.....",
      "..##PDDPPPPPPDDPPPPPPDDPPPPPPDD##.....",
      "....####...#TTT#...####..####.........",
      "..........#TTTTT#.....................",
      "..........#TT#TTT#....................",
      ".........#TTT##TTT#...................",
      ".........#TTT#.#TTT#..................",
      "........#TTTT#..#TTT#.................",
      "........#TTTT#...#TTT#................",
      ".......#TTTT#.....#TTT#...............",
      ".......#TTTT#......#TT#...............",
      ".......#TTTT#.......##................",
      "......#TTTTT#.........................",
      "......#TTTTT#.........................",
      ".....#TTTTTT#.........................",
      ".....#TTTTTTT#........................",
      "....#TTTTTTTT#........................",
      "...#TTTT#TTTTT#.......................",
      "..#TTTT#..#TTTT#......................",
      ".#TTTT#....#TTTT#.....................",
      "#TTTT#......#TTTT#....................",
      "######......######....................",
    ],
  },
};
