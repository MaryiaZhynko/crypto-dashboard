interface ITickerWsEnvelope {
  event: string;
  data: unknown;
}

export const parseTickerWsEnvelope = (
  raw: string,
): ITickerWsEnvelope | null => {
  try {
    const parsed: unknown = JSON.parse(raw);

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('event' in parsed) ||
      typeof parsed.event !== 'string'
    ) {
      return null;
    }

    const data = 'data' in parsed ? parsed.data : undefined;
    return { event: parsed.event, data };
  } catch {
    console.error('Error parsing WebSocket message:', raw);
  }

  return null;
};
