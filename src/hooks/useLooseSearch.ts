// Thank god for stack overflow
//  https://stackoverflow.com/questions/55233713/match-sub-string-within-a-string-with-tolerance-of-1-character-mismatch-in-js

export default function useLooseSearch(inputText: string) {
  // generate regex for all possibilities. for this case, it will generate "d?.?og|do?.?g|dog?.?" -> double .? are for 1 char insertion
  const outputArr = inputText
    .split("")
    .map((letter, letterIndex, letterArray) =>
      letterIndex < letterArray.length - 1
        ? `${inputText.substr(0, letterIndex) + letter}?.?${inputText.substr(
            letterIndex + 1
          )}`
        : ""
    );
  if (!outputArr) return ""; // this returns all results if the search string is empty
  outputArr.pop();
  const outputStr = `( |^)(${outputArr.join("|")})`;
  // console.log(outputStr);
  return outputStr;
}
