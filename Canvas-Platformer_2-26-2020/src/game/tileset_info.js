    /////////////////////////////////////////////////////////////////////////////
    // tileset_info.js                                                         //
    //     File to hold the tileset global variable.                           //
    //     When it's fully populated, it'll take up a lot of space so it won't //
    //     disrupt the flow of code elsewhere.                                 //
    /////////////////////////////////////////////////////////////////////////////
    "use strict";

    var tileset = [];

    function getTileByName(name)
    {
        for(var i = 0; i < tileset.length; i++)
        {
            if (tileset[i].name == name)
            {
                return tileset[i];
            }
        }
        return null;
    }

    // Grass
    tileset.push({"name":"GRASS_TOP_LEFT_EDGE"              , "x":672, "y":32 , "width":32, "height":32 });
    tileset.push({"name":"GRASS_TOP_RIGHT_EDGE"             , "x":896, "y":32 , "width":32, "height":32 });
    tileset.push({"name":"GRASS_TOP"                        , "x":672, "y":512, "width":32, "height":32 });

    // Flower / Mushrooms
    tileset.push({"name":"PLANT_FLOWER"                     , "x":672, "y":544, "width":32, "height":32 });
    tileset.push({"name":"PLANT_MUSHROOM_SMALL"             , "x":704, "y":544, "width":32, "height":32 });
    tileset.push({"name":"PLANT_MUSHROOM_LARGE"             , "x":736, "y":544, "width":32, "height":32 });

    // Bush
    tileset.push({"name":"PLANT_BUSH"                       , "x":704, "y":512, "width":32, "height":32 });

    // Small Tree
    tileset.push({"name":"PLANT_TREE_BOTTOM_LEFT"           , "x":736, "y":512, "width":32, "height":32 });
    tileset.push({"name":"PLANT_TREE_TOP_LEFT"              , "x":736, "y":480, "width":32, "height":32 });
    tileset.push({"name":"PLANT_TREE_TOP_RIGHT"             , "x":768, "y":480, "width":32, "height":32 });
    tileset.push({"name":"PLANT_TREE_BOTTOM_RIGHT"          , "x":768, "y":512, "width":32, "height":32 });

    // Large Tree
    tileset.push({"name":"PLANT_TREE_LARGE_LEFT_TRUNK"      , "x":800, "y":512, "width":32, "height":32 });
    tileset.push({"name":"PLANT_TREE_LARGE_LEFT_BRANCHES"   , "x":800, "y":480, "width":32, "height":32 });
    tileset.push({"name":"PLANT_TREE_LARGE_LEFT_LEAVES"     , "x":800, "y":448, "width":32, "height":32 });
    tileset.push({"name":"PLANT_TREE_LARGE_MIDDLE_TRUNK"    , "x":832, "y":512, "width":32, "height":32 });
    tileset.push({"name":"PLANT_TREE_LARGE_MIDDLE_BRANCHES" , "x":832, "y":480, "width":32, "height":32 });
    tileset.push({"name":"PLANT_TREE_LARGE_MIDDLE_LEAVES"   , "x":832, "y":448, "width":32, "height":32 });
    tileset.push({"name":"PLANT_TREE_LARGE_RIGHT_TRUNK"     , "x":864, "y":512, "width":32, "height":32 });
    tileset.push({"name":"PLANT_TREE_LARGE_RIGHT_BRANCHES"  , "x":864, "y":480, "width":32, "height":32 });
    tileset.push({"name":"PLANT_TREE_LARGE_RIGHT_LEAVES"    , "x":864, "y":448, "width":32, "height":32 });

    // Bright Rock
    tileset.push({"name":"ROCK_BRIGHT_TOP_LEFT_EDGE"        , "x":704, "y":32 , "width":32, "height":32 });
    tileset.push({"name":"ROCK_BRIGHT_TOP_LEFT_CONCAVE"     , "x":736, "y":32 , "width":32, "height":32 });
    tileset.push({"name":"ROCK_BRIGHT_LEFT_EDGE"            , "x":736, "y":64 , "width":32, "height":32 });
    tileset.push({"name":"ROCK_BRIGHT_BOTTOM_LEFT_EDGE"     , "x":736, "y":96 , "width":32, "height":32 });
    tileset.push({"name":"ROCK_BRIGHT_LEFT_CONCAVE"         , "x":768, "y":96 , "width":32, "height":32 });

    tileset.push({"name":"ROCK_BRIGHT_TOP_MIDDLE"           , "x":768, "y":32 , "width":32, "height":32 });
    tileset.push({"name":"ROCK_BRIGHT_MIDDLE"               , "x":768, "y":64 , "width":32, "height":32 });
    tileset.push({"name":"ROCK_BRIGHT_BOTTOM"               , "x":784, "y":128, "width":32, "height":32 });

    tileset.push({"name":"ROCK_BRIGHT_TOP_RIGHT_EDGE"       , "x":864, "y":32 , "width":32, "height":32 });
    tileset.push({"name":"ROCK_BRIGHT_TOP_RIGHT_CONCAVE"    , "x":832, "y":32 , "width":32, "height":32 });
    tileset.push({"name":"ROCK_BRIGHT_RIGHT_EDGE"           , "x":832, "y":64 , "width":32, "height":32 });
    tileset.push({"name":"ROCK_BRIGHT_BOTTOM_RIGHT_EDGE"    , "x":832, "y":96 , "width":32, "height":32 });
    tileset.push({"name":"ROCK_BRIGHT_RIGHT_CONCAVE"        , "x":800, "y":96 , "width":32, "height":32 });    

    // Bright Pillar
    tileset.push({"name":"PILLAR_BRIGHT_TOP"                , "x":704, "y":64 , "width":32, "height":32 });
    tileset.push({"name":"PILLAR_BRIGHT_MIDDLE"             , "x":704, "y":96 , "width":32, "height":32 });
    tileset.push({"name":"PILLAR_BRIGHT_BOTTOM"             , "x":704, "y":128, "width":32, "height":32 });

    // Dark Rock
    tileset.push({"name":"ROCK_DARK_TOP_LEFT_EDGE"          , "x":704, "y":160, "width":32, "height":32 });
    tileset.push({"name":"ROCK_DARK_TOP_LEFT_CONCAVE"       , "x":736, "y":160, "width":32, "height":32 });
    tileset.push({"name":"ROCK_DARK_LEFT_EDGE"              , "x":736, "y":192, "width":32, "height":32 });
    tileset.push({"name":"ROCK_DARK_BOTTOM_LEFT_EDGE"       , "x":736, "y":224, "width":32, "height":32 });
    tileset.push({"name":"ROCK_DARK_LEFT_CONCAVE"           , "x":768, "y":224, "width":32, "height":32 });

    tileset.push({"name":"ROCK_DARK_TOP_MIDDLE"             , "x":768, "y":160, "width":32, "height":32 });
    tileset.push({"name":"ROCK_DARK_MIDDLE"                 , "x":768, "y":192, "width":32, "height":32 });
    tileset.push({"name":"ROCK_DARK_BOTTOM"                 , "x":784, "y":256, "width":32, "height":32 });

    tileset.push({"name":"ROCK_DARK_TOP_RIGHT_EDGE"         , "x":864, "y":160, "width":32, "height":32 });
    tileset.push({"name":"ROCK_DARK_TOP_RIGHT_CONCAVE"      , "x":832, "y":160, "width":32, "height":32 });
    tileset.push({"name":"ROCK_DARK_RIGHT_EDGE"             , "x":832, "y":192, "width":32, "height":32 });
    tileset.push({"name":"ROCK_DARK_BOTTOM_RIGHT_EDGE"      , "x":832, "y":224, "width":32, "height":32 });
    tileset.push({"name":"ROCK_DARK_RIGHT_CONCAVE"          , "x":800, "y":224, "width":32, "height":32 });

    // Dark Pillar
    tileset.push({"name":"PILLAR_DARK_TOP"                  , "x":704, "y":192, "width":32, "height":32 });
    tileset.push({"name":"PILLAR_DARK_MIDDLE"               , "x":704, "y":224, "width":32, "height":32 });
    tileset.push({"name":"PILLAR_DARK_BOTTOM"               , "x":704, "y":256, "width":32, "height":32 });

    // Ladder
    tileset.push({"name":"LADDER"                           , "x":736, "y":416, "width":32, "height":32 });

    // Water
    tileset.push({"name":"WATER"                            , "x":704, "y":416, "width":32, "height":32 });
    tileset.push({"name":"WATER_SURFACE"                    , "x":704, "y":384, "width":32, "height":32 });

    // Bridge
    tileset.push({"name":"BRIDGE_LEFT_POST"                 , "x":672, "y":288, "width":32, "height":32 });
    tileset.push({"name":"BRIDGE_LEFT_A"                    , "x":704, "y":288, "width":32, "height":32 });
    tileset.push({"name":"BRIDGE_LEFT_B"                    , "x":704, "y":320, "width":32, "height":32 });
    tileset.push({"name":"BRIDGE_LEFT_C"                    , "x":704, "y":352, "width":32, "height":32 });
    tileset.push({"name":"BRIDGE_LEFT_D"                    , "x":736, "y":320, "width":32, "height":32 });
    tileset.push({"name":"BRIDGE_LEFT_E"                    , "x":736, "y":352, "width":32, "height":32 });

    tileset.push({"name":"BRIDGE_MIDDLE_RAIL"               , "x":768, "y":320, "width":32, "height":32 });
    tileset.push({"name":"BRIDGE_MIDDLE_WALKWAY"            , "x":768, "y":352, "width":32, "height":32 });

    tileset.push({"name":"BRIDGE_RIGHT_POST"                , "x":896, "y":288, "width":32, "height":32 });
    tileset.push({"name":"BRIDGE_RIGHT_A"                   , "x":864, "y":288, "width":32, "height":32 });
    tileset.push({"name":"BRIDGE_RIGHT_B"                   , "x":864, "y":320, "width":32, "height":32 });
    tileset.push({"name":"BRIDGE_RIGHT_C"                   , "x":864, "y":352, "width":32, "height":32 });
    tileset.push({"name":"BRIDGE_RIGHT_D"                   , "x":832, "y":320, "width":32, "height":32 });
    tileset.push({"name":"BRIDGE_RIGHT_E"                   , "x":832, "y":352, "width":32, "height":32 });

    tileset.push({"name":"SKY"                              , "x":800, "y":576, "width":32, "height":32 });