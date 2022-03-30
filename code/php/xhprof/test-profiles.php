<?php

require_once 'graph_utils.php';

$profilesDir = '.profiles';
$outputDir = './d3/.example';

$waitFor = '::applyMappings';
$endAfter = '';

foreach (glob("$profilesDir/*/*/*/*.xhprof") as $profileFileName) {
    echo($profileFileName."\n");
    $profile = array_reverse(array_keys(unserialize(file_get_contents($profileFileName))));

    file_put_contents($profileFileName . '.tmp.php', "<?php\n\n\$profile = " . var_export($profile, true));

    // save_batches($profile, "$outputDir/batches", $waitFor, $endAfter);

    // $starters = get_starters($profile);

    // $calls_in_path = get_path_for($waitFor, $profile);

    // save_partials($starters, "$outputDir/partial"); //, $calls_in_path);
}

// - wait for API +link desde el main()
// - strip class loader
// - crear digrafo inverso [cortar en la API]
// - marcar caminos que llegan al target con otro color
