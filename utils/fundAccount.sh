#!/bin/bash

gcmd="/Users/luis/Projects/algorand/sandbox/sandbox goal -d /opt/testnetwork/Node"

ACCOUNT=$(${gcmd} account list|awk '{ print $3 }'|head -n 1)

PAYMENT=$(${gcmd} clerk send --amount 1000 -f ${ACCOUNT} -t 7777777777777777777777777777777777777777777777777774MSJUVU)

echo "PAYMENT="$PAYMENT
