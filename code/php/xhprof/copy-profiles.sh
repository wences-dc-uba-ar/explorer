#!/bin/bash

cosa="mergeWithResumeFromAttachment"
cosa="addFieldValueFromTextAndFormat"

profiles_dir="/var/lib/lxd/storage-pools/default/containers/sb-0/rootfs/mnt/backups/xhprof"
local_dir=$(pwd)/.profiles/$cosa

cd $profiles_dir

files="`grep -l "$cosa" *`"

for afile in $files ; do
    dfile=$local_dir/$(sed -e "s/_/\\//g" <<<"$afile")
    if [ ! -f "$dfile" ] ; then
        echo "new $dfile"
        mkdir -p $(dirname $dfile) || exit 1
        mv $afile $dfile || exit 1
    fi
done

chmod -R a+rwX $local_dir
