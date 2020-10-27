---
title: "Arch Linux Kiosk"
date: 2020-10-27T06:15:00-05:00
draft: false
categories: [general, development]
tags: [linux]
---
Here at Southwestern Adventist University the administration  decided to have TV's as announcement boards. For this I've built an app that works with docker compose and serves the announcements, news & events on localhost. Sorry but I can't share this app at the moment. I had this working on NUCs mounted on the TV's with Ubuntu, but keeping up with it is just so cumbersome, so started looking for an alternative and found Arch Linux. There so many resources I'm using that I've decided to put them all in one place. I'll make sure to reference them at the bottom.

```bash
timedatectl set-ntp true
fdisk /dev/sda
```
Use p to check that the label is not msdos, if it is, change it to gpt. Delete all partitions with d. Create a 512M EFI partition and a linux root x64 partition with n and t (to change the partition type).

Format the partitions:

```bash
mkfs.fat -F32 /dev/sda1
mkfs.ext4 /dev/sda2
```
Mount the partitions:

```bash
mount /dev/sda2 /mnt
mkdir /mnt/boot
mount /dev/sda1 /mnt/boot
```
Install Arch Linux and extras into root partition:

```bash
pacstrap /mnt base linux-lts linux-firmware vim\
    bash-completion networkmanager net-tools openssh\
    reflector wpa_supplicant wireless_tools netctl\
    sudo docker docker-compose git intel-ucode
```
Configure where the partitions will be mounted:

```bash
genfstab -U /mnt >> /mnt/etc/fstab && cat /mnt/etc/fstab
```
Change into the freshly installed Arch Linux root:

```bash
arch-chroot /mnt
```
Set the timezone:

```bash
ln -sf /usr/share/zoneinfo/America/Chicago /etc/localtime
```
Uncomment line 177 to enable en_US.UTF-8 locale and generate

```bash
vim /etc/locale.gen
locale-gen
echo LANG=en_US.UTF-8 > /etc/locale.conf
```
Just change arch for whatever your computer is going to be named:
```bash
echo arch > /etc/hostname
```
Change /etc/hosts to:
```bash
# Static table lookup for hostnames.
# See hosts(5) for details.

127.0.0.1   localhost
::1         localhost
127.0.1.1   arch
```
Change the root password
```bash
passwd
```
Install the EFI Boot Manager
```bash
bootctl --path=/boot install
```
Edit the /boot/loader/loader.conf file to look like this:
```bash
#timeout 3
#console-mode keep
default arch-*
```
Create the /boot/loader/entries/arch.conf file and make it look like this (you can get the root UUID from /etc/fstab):
```bash
title	Arch Linux
linux	/vmlinuz-linux-lts
initrd	/initramfs-linux-lts.img
options	root=UUID=f691168b-f435-453c-b024-bc34baf0fc5f rw
```
Remove the Arch Linux USB, exit the chroot command and reboot
```bash
exit
reboot
```
Login with root and the password you set a few steps ago and start and enable the network:
```bash
systemctl start NetworkManager
systemctl enable NetworkManager
```
Start and enable OpenSSH
```bash
systemctl start sshd
systemctl enable sshd
```
Start and enable Docker
```bash
systemctl start docker
systemctl enable docker
```
Add a user and set the user's password:
```bash
useradd -m -g users -G wheel,docker,audio,video,storage tv-user
passwd tv-user
```
Create swap:
```bash
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
echo 'vm.swappiness=10' > /etc/sysctl.d/99-swappiness.conf
```
Configure wifi:
```
# nmcli con add type wifi ifname wlp3s0 con-name work-wifi ssid work-ssid
# nmcli con edit id work-wifi
nmcli> set ipv4.method auto
nmcli> set 802-1x.eap peap
nmcli> set 802-1x.phase2-auth mschapv2
nmcli> set 802-1x.identity myusername
nmcli> set 802-1x.password mypassword
nmcli> set wifi-sec.key-mgmt wpa-eap
nmcli> activate
nmcli> save
nmcli> quit
```
Reboot
```bash
reboot
```
Login as root and configure mirrors:
```bash
reflector -c "US" -f 12 -l 10 -n 12 --save /etc/pacman.d/mirrorlist
pacman -Su
```
Automatic login
```bash
systemctl edit getty@tty1
```
Modify file to look like this:
```bash
[Service]
ExecStart=
ExecStart=-/usr/bin/agetty --nia username --noclear %I $TERM
```
Remove the tty info for auto-login
```bash
su - username
touch .hushlogin
```
Reboot
```bash
exit
reboot
```
Install packages to setup kiosk
```bash
pacman -S --needed mesa libva-vdpau-driver libva-mesa-driver\
    xorg-server xorg-xinit xorg-xset xf86-video-fbdev\
    alsa-utils\
    gjs gnome-themes-standard\
    webkit2gtk gst-plugins-base gst-plugins-good\
    gst-libav
```
Download GJS Browser
```bash
su - username
curl -L archibold.io/test/gjs/browser -o .browse
chmod a+x .browse
```
Edit .xinitrc to look like this
```bash
# avoid sleep
xset s off -dpms
# browse to local docker service
./.browse --fullscreen http://localhost
```
Add this at the end of the user's .bashrc file
```bash
# startx on login
[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && exec startx > /dev/null 2>&1
```
Done!
```bash
exit
reboot
```
Thanks to all these people for helping me out:
+ [https://marvintan.com/posts/arch-linux-installation-guide-part-1/](https://marvintan.com/posts/arch-linux-installation-guide-part-1/)
+ [https://wiki.learnlinux.tv/index.php/How_to_Install_Arch_Linux](https://wiki.learnlinux.tv/index.php/How_to_Install_Arch_Linux)
+ [https://itsfoss.com/install-arch-linux/](https://itsfoss.com/install-arch-linux/)
+ [https://blog.khmersite.net/2018/08/connect-to-a-wpa2-enterprise-connection-using-nmcli/](https://blog.khmersite.net/2018/08/connect-to-a-wpa2-enterprise-connection-using-nmcli/)
+ [https://webreflection.medium.com/a-minimalistic-64-bit-web-kiosk-for-rpi-3-98e460419b47](https://webreflection.medium.com/a-minimalistic-64-bit-web-kiosk-for-rpi-3-98e460419b47)