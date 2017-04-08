s/^([^ ]+) */\1\n/                               # interface name
s/Link encap:(.*)(  |$).*/\1/                    # link encapsulation
N                                                # append next line to PS
/inet addr/! s/\n[^\n]*$/\n0.0.0.0\n/            # use 0.0.0.0 if no "inet addr"
s/ *inet addr:([^ ]+).*/\1\n/                    # capture ip address if present
s/\n[^\n]*$//                                    # cleanup the last line
s/([^\n]+)\n([^\n]+)\n([^\n]+)/IFACE \1 \3 \2/p  # print entry
s/.*//                                           # empty PS
: loop                                           # \
N                                                #  \
/^\n$/b                                          #   skip until next empty line
s/.*//                                           #  /
b loop                                           # /
