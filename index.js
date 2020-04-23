import React, { useState, useEffect, useRef } from "react";

import {
  TextInput,
  findNodeHandle,
  NativeModules,
  Platform,
} from "react-native";

const mask = NativeModules.RNTextInputMask.mask;
const unmask = NativeModules.RNTextInputMask.unmask;
const setMask = NativeModules.RNTextInputMask.setMask;
export { mask, unmask, setMask };

const TextInputMask = (props, input) => {
  const [masked, setMasked] = useState(false);
  const input = useRef();

  const multilineOSCheck = Platform.OS === "ios" ? false : props.multiline;

  useEffect(() => {
    // Component Mount
    if (props.maskDefaultValue && props.mask && props.value) {
      mask(
        props.mask,
        "" + props.value,
        (text) => input.current && input.current.setNativeProps({ text })
      );
    }

    if (props.mask && !masked) {
      setMasked(true);
      setMask(findNodeHandle(input.current), props.mask);
    }
  }, []);

  useEffect(() => {
    // Receive Props
    mask(
      props.mask,
      "" + props.value,
      (text) => input.current && input.current.setNativeProps({ text })
    );
  }, [props.value]);

  useEffect(() => {
    // Change Mask
    setMask(findNodeHandle(input.current), props.mask);
  }, [props.mask]);

  return (
    <TextInput
      {...props}
      value={undefined}
      ref={(ref) => {
        input.current = ref;
        if (typeof props.refInput === "function") {
          props.refInput(ref);
        }
      }}
      multiline={props.mask && multilineOSCheck}
      onChangeText={(masked) => {
        if (props.mask) {
          const _unmasked = unmask(props.mask, masked, (unmasked) => {
            props.onChangeText && props.onChangeText(masked, unmasked);
          });
        } else {
          props.onChangeText && props.onChangeText(masked);
        }
      }}
    />
  );
};

TextInputMask.defaultProps = {
  maskDefaultValue: true,
};

export default TextInputMask;
