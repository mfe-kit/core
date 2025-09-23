export const useSpreadAttributes = (props) => {
    let result = '';
    for (const key in props) {
        result += `${key}=${props[key]} `;
    }
    return result;
};
//# sourceMappingURL=index.js.map