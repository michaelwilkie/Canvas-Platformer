/////////////////////////////////////////////////////////////////////////////
// tileset_info.js                                                         //
//     File to hold the tileset global variable.                           //
//     When it's fully populated, it'll take up a lot of space so it won't //
//     disrupt the flow of code elsewhere.                                 //
/////////////////////////////////////////////////////////////////////////////
"use strict";

var tileset = [];
tileset["GRASS_TOP_LEFT_EDGE"               ] = { "name":"GRASS_TOP_LEFT_EDGE"              , "x":672, "y":32 , "w":32, "h":32 };
tileset["GRASS_TOP_RIGHT_EDGE"              ] = { "name":"GRASS_TOP_RIGHT_EDGE"             , "x":896, "y":32 , "w":32, "h":32 };
tileset["GRASS_TOP"                         ] = { "name":"GRASS_TOP"                        , "x":672, "y":512, "w":32, "h":32 };

tileset["PLANT_FLOWER"                      ] = { "name":"PLANT_FLOWER"                     , "x":672, "y":544, "w":32, "h":32 };
tileset["PLANT_MUSHROOM_SMALL"              ] = { "name":"PLANT_MUSHROOM_SMALL"             , "x":704, "y":544, "w":32, "h":32 };
tileset["PLANT_MUSHROOM_LARGE"              ] = { "name":"PLANT_MUSHROOM_LARGE"             , "x":736, "y":544, "w":32, "h":32 };

tileset["PLANT_BUSH"                        ] = { "name":"PLANT_BUSH"                       , "x":704, "y":512, "w":32, "h":32 };

tileset["PLANT_TREE_BOTTOM_LEFT"            ] = { "name":"PLANT_TREE_BOTTOM_LEFT"           , "x":736, "y":512, "w":32, "h":32 };
tileset["PLANT_TREE_TOP_LEFT"               ] = { "name":"PLANT_TREE_TOP_LEFT"              , "x":736, "y":480, "w":32, "h":32 };
tileset["PLANT_TREE_TOP_RIGHT"              ] = { "name":"PLANT_TREE_TOP_RIGHT"             , "x":768, "y":480, "w":32, "h":32 };
tileset["PLANT_TREE_BOTTOM_RIGHT"           ] = { "name":"PLANT_TREE_BOTTOM_RIGHT"          , "x":768, "y":512, "w":32, "h":32 };

tileset["PLANT_TREE_LARGE_LEFT_TRUNK"       ] = { "name":"PLANT_TREE_LARGE_LEFT_TRUNK"      , "x":800, "y":512, "w":32, "h":32 };
tileset["PLANT_TREE_LARGE_LEFT_BRANCHES"    ] = { "name":"PLANT_TREE_LARGE_LEFT_BRANCHES"   , "x":800, "y":480, "w":32, "h":32 };
tileset["PLANT_TREE_LARGE_LEFT_LEAVES"      ] = { "name":"PLANT_TREE_LARGE_LEFT_LEAVES"     , "x":800, "y":448, "w":32, "h":32 };
tileset["PLANT_TREE_LARGE_MIDDLE_TRUNK"     ] = { "name":"PLANT_TREE_LARGE_MIDDLE_TRUNK"    , "x":832, "y":512, "w":32, "h":32 };
tileset["PLANT_TREE_LARGE_MIDDLE_BRANCHES"  ] = { "name":"PLANT_TREE_LARGE_MIDDLE_BRANCHES" , "x":832, "y":480, "w":32, "h":32 };
tileset["PLANT_TREE_LARGE_MIDDLE_LEAVES"    ] = { "name":"PLANT_TREE_LARGE_MIDDLE_LEAVES"   , "x":832, "y":448, "w":32, "h":32 };
tileset["PLANT_TREE_LARGE_RIGHT_TRUNK"      ] = { "name":"PLANT_TREE_LARGE_RIGHT_TRUNK"     , "x":864, "y":512, "w":32, "h":32 };
tileset["PLANT_TREE_LARGE_RIGHT_BRANCHES"   ] = { "name":"PLANT_TREE_LARGE_RIGHT_BRANCHES"  , "x":864, "y":480, "w":32, "h":32 };
tileset["PLANT_TREE_LARGE_RIGHT_LEAVES"     ] = { "name":"PLANT_TREE_LARGE_RIGHT_LEAVES"    , "x":864, "y":448, "w":32, "h":32 };

tileset["ROCK_BRIGHT_TOP_LEFT_EDGE"         ] = { "name":"ROCK_BRIGHT_TOP_LEFT_EDGE"        , "x":704, "y":32 , "w":32, "h":32 };
tileset["ROCK_BRIGHT_TOP_LEFT_CONCAVE"      ] = { "name":"ROCK_BRIGHT_TOP_LEFT_CONCAVE"     , "x":736, "y":32 , "w":32, "h":32 };
tileset["ROCK_BRIGHT_LEFT_EDGE"             ] = { "name":"ROCK_BRIGHT_LEFT_EDGE"            , "x":736, "y":64 , "w":32, "h":32 };
tileset["ROCK_BRIGHT_BOTTOM_LEFT_EDGE"      ] = { "name":"ROCK_BRIGHT_BOTTOM_LEFT_EDGE"     , "x":736, "y":96 , "w":32, "h":32 };
tileset["ROCK_BRIGHT_LEFT_CONCAVE"          ] = { "name":"ROCK_BRIGHT_LEFT_CONCAVE"         , "x":768, "y":96 , "w":32, "h":32 };
                                                                                            
tileset["ROCK_BRIGHT_TOP_MIDDLE"            ] = { "name":"ROCK_BRIGHT_TOP_MIDDLE"           , "x":768, "y":32 , "w":32, "h":32 };
tileset["ROCK_BRIGHT_MIDDLE"                ] = { "name":"ROCK_BRIGHT_MIDDLE"               , "x":768, "y":64 , "w":32, "h":32 };
                                                                                            
tileset["ROCK_BRIGHT_TOP_RIGHT_EDGE"        ] = { "name":"ROCK_BRIGHT_TOP_RIGHT_EDGE"       , "x":864, "y":32 , "w":32, "h":32 };
tileset["ROCK_BRIGHT_TOP_RIGHT_CONCAVE"     ] = { "name":"ROCK_BRIGHT_TOP_RIGHT_CONCAVE"    , "x":832, "y":32 , "w":32, "h":32 };
tileset["ROCK_BRIGHT_RIGHT_EDGE"            ] = { "name":"ROCK_BRIGHT_RIGHT_EDGE"           , "x":832, "y":64 , "w":32, "h":32 };
tileset["ROCK_BRIGHT_BOTTOM_RIGHT_EDGE"     ] = { "name":"ROCK_BRIGHT_BOTTOM_RIGHT_EDGE"    , "x":832, "y":96 , "w":32, "h":32 };
tileset["ROCK_BRIGHT_RIGHT_CONCAVE"         ] = { "name":"ROCK_BRIGHT_RIGHT_CONCAVE"        , "x":800, "y":96 , "w":32, "h":32 };
                                                                                            
tileset["PILLAR_TOP"                        ] = { "name":"PILLAR_TOP"                       , "x":704, "y":64 , "w":32, "h":32 };
tileset["PILLAR_MIDDLE"                     ] = { "name":"PILLAR_MIDDLE"                    , "x":704, "y":96 , "w":32, "h":32 };
tileset["PILLAR_BOTTOM"                     ] = { "name":"PILLAR_BOTTOM"                    , "x":704, "y":128, "w":32, "h":32 };

tileset["LADDER"                            ] = { "name":"LADDER"                           , "x":736, "y":416, "w":32, "h":32 };

tileset["WATER"                             ] = { "name":"WATER"                            , "x":704, "y":416, "w":32, "h":32 };
tileset["WATER_SURFACE"                     ] = { "name":"WATER_SURFACE"                    , "x":704, "y":384, "w":32, "h":32 };

tileset["BRIDGE_LEFT_POST"                  ] = { "name":"BRIDGE_LEFT_POST"                 , "x":672, "y":288, "w":32, "h":32 };
tileset["BRIDGE_LEFT_A"                     ] = { "name":"BRIDGE_LEFT_A"                    , "x":704, "y":288, "w":32, "h":32 };
tileset["BRIDGE_LEFT_B"                     ] = { "name":"BRIDGE_LEFT_B"                    , "x":704, "y":320, "w":32, "h":32 };
tileset["BRIDGE_LEFT_C"                     ] = { "name":"BRIDGE_LEFT_C"                    , "x":704, "y":352, "w":32, "h":32 };
tileset["BRIDGE_LEFT_D"                     ] = { "name":"BRIDGE_LEFT_D"                    , "x":736, "y":320, "w":32, "h":32 };
tileset["BRIDGE_LEFT_E"                     ] = { "name":"BRIDGE_LEFT_E"                    , "x":736, "y":352, "w":32, "h":32 };

tileset["BRIDGE_MIDDLE_RAIL"                ] = { "name":"BRIDGE_MIDDLE_RAIL"               , "x":736, "y":320, "w":32, "h":32 };
tileset["BRIDGE_MIDDLE_WALKWAY"             ] = { "name":"BRIDGE_MIDDLE_WALKWAY"            , "x":736, "y":320, "w":32, "h":32 };

tileset["BRIDGE_RIGHT_POST"                 ] = { "name":"BRIDGE_RIGHT_POST"                , "x":896, "y":288, "w":32, "h":32 };
tileset["BRIDGE_RIGHT_A"                    ] = { "name":"BRIDGE_RIGHT_A"                   , "x":864, "y":288, "w":32, "h":32 };
tileset["BRIDGE_RIGHT_B"                    ] = { "name":"BRIDGE_RIGHT_B"                   , "x":864, "y":320, "w":32, "h":32 };
tileset["BRIDGE_RIGHT_C"                    ] = { "name":"BRIDGE_RIGHT_C"                   , "x":864, "y":352, "w":32, "h":32 };
tileset["BRIDGE_RIGHT_D"                    ] = { "name":"BRIDGE_RIGHT_D"                   , "x":832, "y":320, "w":32, "h":32 };
tileset["BRIDGE_RIGHT_E"                    ] = { "name":"BRIDGE_RIGHT_E"                   , "x":832, "y":352, "w":32, "h":32 };

tileset["SKY"                               ] = { "name":"SKY"                              , "x":800, "y":576, "w":32, "h":32 };












