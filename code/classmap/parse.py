#!/usr/bin/env python3.8

import argparse
import os
import re

parser = argparse.ArgumentParser()
parser.add_argument("--filter", help="string to filter first subdir after '<places>/'", default=None)
parser.add_argument("--inputDir", help=f"dump directory (default: .src)", default=".src")
parser.add_argument("--outputDir", help=f"dump directory (default: .public)", default=".public")

args = parser.parse_args()

filter = args.filter
inputDir = args.inputDir
outputDir = args.outputDir
places = ["jscore/module", "jscore/phpcore", "module", "module/semanticmapping"]


def createAllMaps(baseDir, places, outDir, overwrite=False):
    for place in [os.path.join(baseDir, aPlace) for aPlace in places]:
        for item in os.listdir(place):
            subDir = os.path.join(place, item)
            if os.path.isdir(subDir):
                mapFile = subDir.replace(baseDir, outDir) + ".md"
                if overwrite or not os.path.exists(mapFile):
                    mapTitle = subDir.replace(f"{baseDir}/", "")
                    mapData = createMap(subDir)
                    if not os.path.isdir(os.path.dirname(mapFile)):
                        os.makedirs(os.path.dirname(mapFile), exist_ok=True)
                    with open(mapFile, "w") as file:
                        file.write(wrapMd(mapTitle, mapData))


def createMap(subDir):
    theMap = []
    for root, dirs, files in os.walk(subDir, followlinks=True):
        for file in files:
            if file.endswith(".php"):
                with open(os.path.join(root, file)) as file:
                    details = getDetails(file)
                    if details:
                        theMap.append(details)
    theMap.sort()
    return "\n".join(theMap)
    # TODO: split forest into trees


def getDetails(file):
    for line in file:
        captured = re.search("([a-zA-Z_]+) extends ([a-zA-Z_]+)", line)
        if captured:
            [childClass, ParentClass] = captured.groups()
            return f"{ParentClass}-->{childClass}"
        # TODO: take into account namespaces, interfaces


def wrapMd(theName, theMap):
    return f"# {theName}\n\n```mermaid\ngraph LR\n{theMap}\n```\n\n"


createAllMaps(inputDir, places, outputDir)
print("done")
