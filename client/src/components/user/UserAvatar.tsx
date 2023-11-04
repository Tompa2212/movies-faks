import { User } from 'next-auth';
import React from 'react';
import Image from 'next/image';
import { AvatarProps } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import Icon from '../ui/Icons';

type UserAvatarProps = {
  user: Pick<User, 'firstName' | 'image'>;
} & AvatarProps;

const UserAvatar = ({
  user: { firstName, image },
  ...props
}: UserAvatarProps) => {
  console.log(image);
  return (
    <Avatar {...props}>
      {image ? (
        <div className="relative w-full h-full aspect-square">
          <Image
            fill
            src={image}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{firstName}</span>
          <Icon name="User" className="w-6 h-6" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
