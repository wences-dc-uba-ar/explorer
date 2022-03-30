<?php

function save_batches(array $profile, $outputDir, $waitFor = '', $endAfter = '', $batchSize = 50, $hardLimit = 15000) {
    $skips = 0;
    // $inorderTransitions = array_reverse($profile);
    $inorderTransitions = $profile;
    $batchIndex = 0;
    $count = 0;
    $started = false;
    while (count($inorderTransitions) && $hardLimit >0) {
        $batch = [];
        while (count($inorderTransitions) && count($batch) < $batchSize && $hardLimit-- >0) {
            $edge= array_pop($inorderTransitions);
            if ($started || !$waitFor || substr_count($edge, $waitFor)) {
                $started = true;
                $item = str_replace('\\', '/', $edge);
                list($from, $to) = explode('==>', $item . '==>o');
                $batch[] = "\"$from\" -> \"$to\"";
                $count++;
            } else {
                $skips++;
            }
            if ($endAfter && substr_count($edge, $endAfter)) {
                $endAfter = true;
                break;
            }
        }
        file_put("$outputDir/" . ($batchIndex++) . '.dot', "digraph {\n" . implode("\n", $batch) . "\n}");
        if ($endAfter===true) {
            break;
        }
    }

    echo("\nStats:\n");
    if ($waitFor) {
        echo("skipped $skips calls before '$waitFor'\n");
    }
    echo("proccessed $count calls.\n\n");
}

function get_starters($edgeList) {
    return array_reduce($edgeList, function ($partial_starters, $transition) {
        $transition = str_replace('\\', '/', $transition);
        list($start, $end) = explode('==>', $transition . '==>');
        if ($end) {
            $partial_starters[$start][] = $end;
        }
        return $partial_starters;
    }, []);
}

// function get_path_for($waitFor, $profile) {
//     $calls_in_path = [];
//     $enders = get_enders($profile);
//     return $calls_in_path;
// }

function get_enders($edgeList) {
    return array_reduce($edgeList, function ($partial_enders, $transition) {
        $transition = str_replace('\\', '/', $transition);
        list($start, $end) = explode('==>', $transition . '==>');
        if ($end) {
            $partial_enders[$end][] = $start;
        }
        return $partial_enders;
    }, []);
}

function save_partials($starters, $outputDir) {
    foreach ($starters as $from => $toList) {
        $fromBasename = preg_replace('/[:_]+/', '/', $from);
        $fromBasename = preg_replace('/[^a-zA-Z0-9\/]/', '', $fromBasename);

        $tags = [];

        if (random_int(0,10) > 5) {
            $tags[]='critic';
        }

        file_put_json("$outputDir/$fromBasename.json", [
            'name' => $from,
            'children' => pruneByPattern(filterBuiltIns($toList, $starters)),
            'tags' => $tags
        ]);
    }
}

function filterBuiltIns($list, $profile) {
    return array_values(array_filter($list, function ($f) use ($profile) {
        return !function_exists($f) || isset($profile[$f]);
    }));
}

function pruneByPattern($list) {
    $patterns = [
        '/^COR_.+/'
    ];
    return array_values(array_filter($list, function ($item) use ($patterns) {
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $item)) {
                return false;
            }
        }
        return true;
    }));
}

function file_put_json($filename, $data) {
    return file_put($filename, json_encode($data, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));
}

function file_put($filename, $data) {
    if (!is_dir(dirname($filename))) {
        mkdir(dirname($filename), 0777, true);
    }
    return file_put_contents($filename, $data);
}
