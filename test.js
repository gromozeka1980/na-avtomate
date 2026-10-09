// node test.js — проверка теории (написание нот, тональности, интервалы)
const assert = require('assert');
const T = require('./theory.js');
const s = n => T.nm(n, 'let');
const sc = K => T.scale(K).map(s).join(' ');

assert.strictEqual(sc({ k: 4, m: 0 }), 'E F♯ G♯ A B C♯ D♯');
assert.strictEqual(sc({ k: 6, m: 0 }), 'F♯ G♯ A♯ B C♯ D♯ E♯');
assert.strictEqual(sc({ k: -7, m: 0 }), 'C♭ D♭ E♭ F♭ G♭ A♭ B♭');
assert.strictEqual(sc({ k: 6, m: 1 }), 'D♯ E♯ F♯ G♯ A♯ B C♯');
assert.strictEqual(sc({ k: -7, m: 1 }), 'A♭ B♭ C♭ D♭ E♭ F♭ G♭');
assert.strictEqual(sc({ k: -1, m: 1 }), 'D E F G A B♭ C');
assert.strictEqual(T.sigNotes(3).map(s).join(' '), 'F♯ C♯ G♯');
assert.strictEqual(T.sigNotes(-4).map(s).join(' '), 'B♭ E♭ A♭ D♭');
// у каждой тональности знаки ровно те, что в гамме
for (const K of T.keys(7, true)) {
  const alt = T.scale(K).filter(n => n.a).map(s).sort();
  assert.deepStrictEqual(alt, T.sigNotes(K.k).map(s).sort(), JSON.stringify(K));
}
// интервалы: б3 от D = F♯, ум5 от B = F, ув4 от F = B
const iv = (n, name) => s(T.up(n, ...T.INT.find(i => i[0] === name).slice(1, 3)));
assert.strictEqual(iv(T.N(1), 'б3'), 'F♯');
assert.strictEqual(iv(T.N(6), 'ум5'), 'F');
assert.strictEqual(iv(T.N(3), 'ув4'), 'B');
assert.strictEqual(iv(T.N(4, -1), 'м3'), 'B𝄫'); // G♭ + м3 = B𝄫 (такие вопросы отфильтрованы)
// аккорды
const ch = (r, sym) => T.tonesOf(r, T.CHORDS.find(c => c.s === sym)).map(s).join(' ');
assert.strictEqual(ch(T.N(0), '7♯9'), 'C E G B♭ D♯');
assert.strictEqual(ch(T.N(1), 'm7♭5'), 'D F A♭ C');
assert.strictEqual(ch(T.N(6), '°7'), 'B D F A♭');
assert.strictEqual(ch(T.N(0), '13'), 'C E G B♭ D A');
assert.strictEqual(ch(T.N(4), '7alt'), 'G B F A♭ A♯ C♯ E♭');
assert.strictEqual(ch(T.N(3), 'maj7♯11'), 'F A C E B');
assert.strictEqual(new Set(T.CHORDS.map(c => c.s)).size, T.CHORDS.length);
// немецкая система
assert.strictEqual(T.nm(T.N(6), 'let', true), 'H');
assert.strictEqual(T.nm(T.N(6, -1), 'let', true), 'B');
// гитара: 3-я струна 8-й лад = D♯3, записывается D♯4
assert.strictEqual(T.OPEN[2] + 8, 63);
assert.strictEqual(T.stepMidi({ s: T.midiStep(63 + 12), a: 1 }), 75);
assert.strictEqual(T.midiStep(52), 23); // E3
console.log('ok');
