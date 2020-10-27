import { CountdownPipe } from './countdown.pipe';

describe('CountdownPipe', () => {
  it('create an instance', () => {
    const pipe = new CountdownPipe();
    expect(pipe).toBeTruthy();
  });

  it('不傳值 會空白', () => {
    const pipe = new CountdownPipe();
    const data: any = null;
    expect(pipe.transform(data)).toEqual('00:00:00');
  });

  it('無值 可以轉換分秒', () => {
    const pipe = new CountdownPipe();
    const data: any = null;
    expect(pipe.transform(data, 'mm:ss')).toEqual('00:00');
  });

  it('有值 可以轉換 時分秒', () => {
    const pipe = new CountdownPipe();
    expect(pipe.transform(19)).toEqual('00:00:19');
  });

  it('超過24小時, 會顯示小時', () => {
    const pipe = new CountdownPipe();
    expect(pipe.transform(180660)).toEqual('50:11:00');
  });

  it('有值 可以轉換 分秒', () => {
    const pipe = new CountdownPipe();
    expect(pipe.transform(19, 'mm:ss')).toEqual('00:19');
  });
});

