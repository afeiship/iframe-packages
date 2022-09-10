type Role = 'child' | 'parent' | 'standalone';
const colors = { parent: '#2082bf', child: '#97c232', standalone: '#8b42d9' };

export const log = (inRole: Role, ...inArgs) => {
  console.log(
    `%c[ifm-debug:${inRole}]:`,
    `padding: 1px; border-radius: 3px; color: #fff; background: ${colors[inRole]};`,
    ...inArgs
  );
};
