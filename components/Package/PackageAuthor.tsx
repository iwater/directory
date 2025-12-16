import SHA256 from 'crypto-js/sha256';
import { View } from 'react-native';

import { A, Label } from '~/common/styleguide';
import UserAvatar from '~/components/Package/UserAvatar';
import Tooltip from '~/components/Tooltip';
import { type NpmUser } from '~/types';
import tw from '~/util/tailwind';

type Props = {
  author?: NpmUser;
  compact?: boolean;
};

const authorContainerStyle = tw`flex flex-row gap-3 items-center bg-transparent`;
const sublabelStyle = tw`text-[11px] font-light text-palette-gray4 dark:text-secondary`;

export default function PackageAuthor({ author, compact }: Props) {
  if (!author) {
    return (
      <View>
        <Label>Unknown</Label>
      </View>
    );
  }

  if (author?.url && !author.url.includes('@')) {
    if (author.url.includes('github.com/')) {
      const [, potentialGHUsername] = author.url.split('github.com/');
      const ghUsername = potentialGHUsername.replace(/[<>()]/g, '');
      const validName = getValidName(author.name);

      return (
        <View>
          <A href={`https://github.com/${ghUsername}`} style={authorContainerStyle}>
            <UserAvatar src={`https://github.com/${ghUsername}.png`} alt={`${ghUsername} avatar`} />
            <View>
              <span>{ghUsername}</span>
              <span style={sublabelStyle}>{validName}</span>
            </View>
          </A>
        </View>
      );
    }

    return (
      <View>
        <A href={author.url} target="_blank">
          <Label>{author.name ?? 'Unknown'}</Label>
        </A>
      </View>
    );
  }

  if (author.email || (author?.url && author.url.includes('@'))) {
    const email = author.email ?? author.url;

    if (compact) {
      return (
        <View style={authorContainerStyle}>
          <Tooltip
            sideOffset={2}
            delayDuration={100}
            trigger={
              <UserAvatar
                src={`https://gravatar.com/avatar/${SHA256(email!).toString()}?d=retro`}
                alt={`${author.name} avatar`}
              />
            }>
            <View style={tw`flex`}>
              <span>{author.name}</span>
              <span style={sublabelStyle}>{email}</span>
            </View>
          </Tooltip>
        </View>
      );
    }

    return (
      <View style={authorContainerStyle}>
        <UserAvatar
          src={`https://gravatar.com/avatar/${SHA256(email!).toString()}?d=retro`}
          alt={`${author.name} avatar`}
        />
        <View>
          <span>{author.name}</span>
          <span style={sublabelStyle}>{email}</span>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Label>{getValidName(author.name) ?? 'Unknown'}</Label>
    </View>
  );
}

function getValidName(potentialName: string): string {
  const cleanName = potentialName
    .split(' ')
    .filter(word => !(word.includes('(') || word.includes('/') || word.includes('<')))
    .join(' ');
  return cleanName.length ? cleanName : potentialName.replace(/[<>()]/g, '');
}
