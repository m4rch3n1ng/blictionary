#!/usr/bin/env bash

cwd=$(realpath .)

NPM=$(ps aux | grep [n]pm)
NODE=$(ps aux | grep [n]ode)

amt=0
while read u pid r; do 
	if [ $pid ]; then
		pwd=$(pwdx $pid 2> /dev/null | cut "-d " -f 2)
		[ $pwd ] && [ $pwd = $cwd ] && kill $pid && amt=$(( amt + 1))
	fi
done <<< "$NPM"

while read u pid r; do
	if [ $pid ]; then
		pwd=$(pwdx $pid 2> /dev/null | cut "-d " -f 2) 
		[ $pwd ] && [ $pwd = $cwd ] && kill $pid && amt=$(( amt + 1))
	fi
done <<< $NODE

echo -e "\033[0;31mstopped\033[0m" $amt processes
