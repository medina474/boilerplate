;
; ################################################################################
; Ctrl+^ = Insert Contents of Clipboard
; ################################################################################
^^::
{
SendInput "{Raw}" A_Clipboard
}