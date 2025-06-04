import { Button } from '@/app/components/ui/button';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const 기본: Story = {
  args: {
    children: '기본 버튼',
  },
};

export const 파랑: Story = {
  args: {
    variant: 'blue',
    children: '파란 버튼',
  },
};

export const 성공: Story = {
  args: {
    variant: 'success',
    children: '성공 버튼',
  },
};

export const 파괴: Story = {
  args: {
    variant: 'destructive',
    children: '삭제(파괴) 버튼',
  },
};

export const 크기_큰버튼: Story = {
  args: {
    children: '큰 버튼',
    size: 'lg',
  },
};
