-- grid size storing
local vec2GridSize = {} --Vector2. vec2GridSize[x] = int
local vec2GridPos = {}

function SetupGrid()
    vec2GridSize["x"] = 0
    vec2GridSize["y"] = 0
    vec2GridPos["x"] = 0
    vec2GridPos["y"] = 0
end
SetupGrid()

-- easier move function
-- ex: Move("up")
function Move(dir)
    --print("new movement: "..dir)
    if dir == 'up' then
        turtle.up()
    elseif dir == 'down' then
        turtle.down()
    elseif dir == 'left' then
        turtle.turnLeft()
        turtle.forward()
        turtle.turnRight()
    elseif dir == 'right' then
        turtle.turnRight()
        turtle.forward()
        turtle.turnLeft()
    elseif dir == 'forward' then
        turtle.forward()
    elseif dir == 'back' then
        turtle.back()
    else
        print("not a valid dir.")
    end
end

-- dictonnaries
names = {} -- blockData.name == "string"
blockTags = {} -- blockData.tags[string] == bool
seeds = {} -- all seed names.
cropHeights = {} -- crop heights
cropMaturity = {} --crop mature age

-- strings for dicts
mcPrefix = "minecraft:"
farmPrefix = "farmersdelight:"
supp = "supplementaries:"
w = "wheat"
c = "carrots"
p = "potatoes"
r = "rice"
f = "flax"
wtr = "water"

-- set the names for possible crop blocks
function SetNames()
    names[w] = mcPrefix..w -- names[wheat] == minecraft:wheat
    names[c] = mcPrefix..c -- names[carrots] == minecraft:carrots
    names[p] = mcPrefix..p -- names[potatoes] == minecraft:potatoes
    names[r] = farmPrefix..r.."_upper_crop"
    names[f] = supp..f -- namesflax== supplementaries:flax
    names[wtr] = mcPrefix..wtr -- names[water] == minecraft:water
end
SetNames()

function SetSeedNames() -- get crop seed names
    seeds[w] = mcPrefix..w.."_seeds"
    seeds[c] = mcPrefix.."carrot"
    seeds[p] = mcPrefix.."potato"
    seeds[r] = farmPrefix..r
    seeds[f] = supp..f.."_seeds"
end
SetSeedNames()

function SetCropHeight() --get max height of crops
    cropHeights[w] = 1
    cropHeights[c] = 1
    cropHeights[p] = 1
    cropHeights[r] = 1
    cropHeights[f] = 2
end
SetCropHeight()

function SetCropAge() --get max age of crops
    cropMaturity[w] = 7
    cropMaturity[c] = 7
    cropMaturity[p] = 7
    cropMaturity[r] = 3
    cropMaturity[f] = 7
end
SetCropAge()

-- give the seed name of the crop
function CompareCropNames(input)
    if input == names[w] then  do return seeds[w] end
    elseif input == names[c] then do return seeds[c] end
    elseif input == names[p] then do return seeds[p] end
    elseif input == names[r] then do return seeds[r] end
    elseif input == names[f] then do return seeds[f] end
end
end

-- give the mature age of the crop
function CompareCropAge(input)
    if names[input] == names[w] then  do return cropMaturity[w] end
    elseif names[input] == names[c] then do return cropMaturity[c] end
    elseif names[input] == names[p] then do return cropMaturity[p] end
    elseif names[input] == names[r] then do return cropMaturity[r] end
    elseif names[input] == names[f] then do return cropMaturity[f] end
    else return false end
end


-- set the strings for possible tags
function SetTags()
    blockTags["isCrop"] = mcPrefix.."crops"
    blockTags["beeGrow"] = mcPrefix.."bee_growables"
    blockTags["turtleHoe"] = "computercraft:turtle_hoe_harvestable"
end

SetTags()

-- return the block under and its data
function ReturnBelow()
    local success, data = turtle.inspectDown()
    if success then
        do return success, data end
    else
        -- print("no blocks detected")
    end
end

function DetermineCropType(blockName)
    if blockName == names[w] then
        -- print("this is wheat crop")
        do return names[w] end
    elseif dat.name == names[c] then
        -- print("this is carrots crop")
        do return names[c] end
    elseif dat.name == names[p] then
        -- print("this is potatoes crop")
        do return names[p] end
    elseif dat.name == names[f] then
        -- print("this is a flax crop")
        do return names[f] end
    elseif dat.name == names[r] then
        -- print("this is a rice crop")
        do return names[r] end
    else
        print("cannot figure out what this is")
    end
end

function BlockHasCropName(input)
    if input == names[w] then do return true end
    elseif input == names[c] then do return true end
    elseif input == names[p] then do return true end
    elseif input == names[r] then do return true end
    elseif input == names[f] then do return true end
    else
        do return false end
    end
end

function DetermineGridHeight()
    print("starting to determine Grid Height!")
    local reachedEnd = false
    while reachedEnd == false do
        -- keep moving forward and counting the distance until reaching the end of the farm.
        Move("forward")
        vec2GridSize["y"] = vec2GridSize["y"] + 1
        local hasBlock, data = turtle.inspectDown() -- check block under to see if you reached the end of the farm
        
        if HasReachedFarmEnd(hasBlock, data) then
            print("reached farm's end!!")
            reachedEnd = true
        end
    end
    print("grid Y max is: "..vec2GridSize["y"])
    Move("back")
end

function BlockIsCrop(input)
    if input == names[w] then
        do return true end
    elseif input == names[c] then
        do return true end
    elseif input == names[p] then
        do return true end
    elseif input == names[r] then
	    do return true end
    elseif input == names[f] then
	    do return true end
    else
        print("block isn't crop")
        do return false end
    end
end

function HasReachedFarmEnd(b,d)
    if b == true then -- block detected, make sure it's a crop
	    --print(BlockIsCrop(d.name))
        if BlockIsCrop(d.name) == true then
            --print(d.name)
            return false -- it's a crop, keep going
        else
            do return true end
        end
    else
        -- Have to check if end of farm, or water block
        Move("down")
        b, d = ReturnBelow()
        Move("up")

        if b == nil then
            do return true end
        elseif b == true then
            if d.name == names[wtr] then -- if it were a water block, would keep going.
                -- print("this is a water block.")
                return false
            else -- water was not present. 
                -- print("not water")
                return true
            end
        end
    end
end

function DetermineGridLength()
    -- print("starting to determine Grid Height!")
    local reachedEnd = false
    while reachedEnd == false do
        -- keep moving forward and counting the distance until reaching the end of the farm.
        Move("right")
        vec2GridSize["x"] = vec2GridSize["x"] + 1
        local hasBlock, data = turtle.inspectDown() -- check block under to see if you reached the end of the farm
        
        if HasReachedFarmEnd(hasBlock, data) then
            print("reached farm's end!!")
            reachedEnd = true
        end
    end
    print("grid X max is: "..vec2GridSize["x"])
    Move("left")
end

function Reap()
    print("--- Reaping")
    local curCrop = ""
    local b,d = ReturnBelow()
    if d == nil then
        do return end
    end
    curCrop = d.name
    print("curCrop is: "..curCrop)
    print("its seeds are: "..CompareCropNames(curCrop))
    print("----------")
    
    if b then
        if IsCropOldEnough(d.name, d["state"].age) then
            --print("old enough to reap")
            turtle.digDown()
            --print(curCrop)
            
            Sow(CompareCropNames(curCrop))

        else 
            print("crop not old enough...")
        end
    end
end

function IsCropOldEnough(cropName, age)
    if cropName == names[r] and age == 3 then
        do return true end
    elseif cropName == names[w] and age == 7 then
        do return true end
    elseif cropName == names[c] and age == 7 then
        do return true end
    elseif cropName == names[p] and age == 7 then
        do return true end
    elseif cropName == names[f] and age == 7 then
        do return true end
    end
end

function Sow(item)
    print("--- Sowing "..item)
    local d
    for i=1,16 do
        turtle.select(i)
        d = turtle.getItemDetail()
        -- print("------------")
        -- print(d)
        -- print("------------")
        if d == null then
            print("no item in slot.")
        elseif d.name == item then
            break
        else
            -- print("a")
        end
    end
    if item == seeds[f] then
        turtle.down()
    end
   turtle.placeDown()
   if item == seeds[f] then
        turtle.up()
   end
end

function LoopCrop()
    local direction = -1
    Reap()
    while vec2GridPos["x"] > 1 do
        if direction == -1 then
            while vec2GridPos["y"] > 1 do
            Reap()
            Move("back")
	    vec2GridPos["y"] = vec2GridPos["y"]-1
            end
        elseif direction == 1 then
            while vec2GridPos["y"] < vec2GridSize["y"] do
            Reap()
            Move("forward")
	    vec2GridPos["y"] = vec2GridPos["y"]+1
            end
        end
    Reap()
    direction = direction *-1
    Move("left")
    vec2GridPos["x"] = vec2GridPos["x"]-1
    end
    -- XPosition is 0. Uneven gridSize will have YPosition be vec2GridSize, and otherwise 0.
    if direction == -1 then
        while vec2GridPos["y"] > 1 do
            Reap()
            Move("back")
            vec2GridPos["y"] = vec2GridPos["y"] -1
        end
    Reap()
    end
end

function START()
    DetermineGridHeight()
    DetermineGridLength()
    vec2GridPos["x"] = vec2GridSize["x"]
    vec2GridPos["y"] = vec2GridSize["y"]
    LoopCrop()
end
START()
-- Reap()
